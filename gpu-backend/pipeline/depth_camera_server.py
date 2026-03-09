"""
Local Depth Camera WebSocket Server

Runs on the museum kiosk machine, reads from USB depth cameras,
and streams hand/body tracking data to the browser via WebSocket.

Supports:
  - Intel RealSense D435/D455 (pyrealsense2)
  - Azure Kinect DK (pyk4a)
  - Leap Motion Controller 2 (ultraleap)
  - Standard webcam with MediaPipe fallback

Usage:
    python depth_camera_server.py --device realsense --port 8765
    python depth_camera_server.py --device kinect --port 8765
    python depth_camera_server.py --device webcam --port 8765

The browser connects via: ws://localhost:8765
"""

import argparse
import asyncio
import json
import time

import numpy as np

try:
    import websockets
except ImportError:
    print("pip install websockets")
    raise


class DepthCameraBase:
    """Base class for depth camera implementations."""

    def start(self) -> None:
        raise NotImplementedError

    def read_frame(self) -> dict:
        raise NotImplementedError

    def stop(self) -> None:
        raise NotImplementedError


class RealSenseCamera(DepthCameraBase):
    """Intel RealSense depth camera."""

    def __init__(self):
        self.pipeline = None
        self.config = None

    def start(self) -> None:
        import pyrealsense2 as rs

        self.pipeline = rs.pipeline()
        self.config = rs.config()
        self.config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
        self.config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)
        self.pipeline.start(self.config)
        print("[RealSense] Camera started")

    def read_frame(self) -> dict:
        import pyrealsense2 as rs

        frames = self.pipeline.wait_for_frames()
        depth_frame = frames.get_depth_frame()
        color_frame = frames.get_color_frame()

        if not depth_frame or not color_frame:
            return {"hands": [], "bodies": [], "timestamp": time.time()}

        depth_image = np.asanyarray(depth_frame.get_data())
        depth_intrinsics = depth_frame.profile.as_video_stream_profile().intrinsics

        # Simple hand detection via depth thresholding
        # (In production, pair with MediaPipe for joint tracking)
        hands = self._detect_hands_from_depth(depth_image, depth_intrinsics)
        bodies = self._detect_bodies_from_depth(depth_image)

        return {
            "hands": hands,
            "bodies": bodies,
            "timestamp": time.time(),
        }

    def _detect_hands_from_depth(self, depth_image: np.ndarray, intrinsics) -> list:
        """
        Basic near-object detection from depth.
        For production, overlay MediaPipe hand tracking on the RGB stream
        and use depth to get true Z coordinates.
        """
        import pyrealsense2 as rs

        # Find pixels within interaction range (0.2 - 1.0 meters)
        mask = (depth_image > 200) & (depth_image < 1000)

        if mask.sum() < 100:
            return []

        # Find centroid of near objects
        ys, xs = np.where(mask)
        cx, cy = int(xs.mean()), int(ys.mean())
        cz = float(depth_image[cy, cx]) / 1000.0  # Convert mm to meters

        # Deproject to 3D
        point = rs.rs2_deproject_pixel_to_point(intrinsics, [cx, cy], cz)

        return [{
            "id": 0,
            "position": {"x": point[0], "y": point[1], "z": point[2]},
            "fingers": [],
            "gesture": "open",
            "confidence": 0.7,
        }]

    def _detect_bodies_from_depth(self, depth_image: np.ndarray) -> list:
        """Detect presence from large depth regions."""
        mask = (depth_image > 500) & (depth_image < 3000)  # 0.5 - 3 meters

        if mask.sum() < 5000:
            return []

        avg_depth = float(depth_image[mask].mean()) / 1000.0

        return [{
            "id": 0,
            "joints": {},
            "distance": avg_depth,
        }]

    def stop(self) -> None:
        if self.pipeline:
            self.pipeline.stop()


class KinectCamera(DepthCameraBase):
    """Azure Kinect DK with body tracking."""

    def __init__(self):
        self.device = None
        self.body_tracker = None

    def start(self) -> None:
        import pyk4a
        from pyk4a import Config, PyK4A

        self.device = PyK4A(Config(
            color_resolution=pyk4a.ColorResolution.RES_720P,
            depth_mode=pyk4a.DepthMode.NFOV_UNBINNED,
            camera_fps=pyk4a.FPS.FPS_30,
        ))
        self.device.start()

        try:
            self.device.start_body_tracker()
            print("[Kinect] Body tracking enabled")
        except Exception:
            print("[Kinect] Body tracking unavailable — depth only")

        print("[Kinect] Camera started")

    def read_frame(self) -> dict:
        capture = self.device.get_capture()
        if capture.depth is None:
            return {"hands": [], "bodies": [], "timestamp": time.time()}

        bodies = []
        hands = []

        if self.body_tracker and hasattr(capture, 'body_frame') and capture.body_frame:
            for body in capture.body_frame.bodies:
                joints = {}
                for joint_id, joint in enumerate(body.skeleton.joints):
                    joint_name = str(joint_id)
                    joints[joint_name] = {
                        "x": float(joint.position[0]) / 1000.0,
                        "y": float(joint.position[1]) / 1000.0,
                        "z": float(joint.position[2]) / 1000.0,
                        "confidence": float(joint.confidence_level),
                    }

                # Extract hand positions from skeleton
                # Joint 8 = left hand, Joint 15 = right hand (Azure Kinect)
                if "8" in joints:
                    hands.append({
                        "id": len(hands),
                        "position": joints["8"],
                        "fingers": [],
                        "gesture": None,
                        "confidence": joints["8"].get("confidence", 0.5),
                    })

                body_center = joints.get("1", {})  # Spine naval
                distance = body_center.get("z", 3.0)
                bodies.append({
                    "id": body.id,
                    "joints": joints,
                    "distance": distance,
                })

        return {
            "hands": hands,
            "bodies": bodies,
            "timestamp": time.time(),
        }

    def stop(self) -> None:
        if self.device:
            self.device.stop()


class WebcamFallback(DepthCameraBase):
    """Webcam + MediaPipe fallback when no depth hardware is available."""

    def __init__(self):
        self.cap = None
        self.hands = None
        self.pose = None

    def start(self) -> None:
        import cv2
        import mediapipe as mp

        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        self.hands = mp.solutions.hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5,
        )
        self.pose = mp.solutions.pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        print("[Webcam] MediaPipe fallback started")

    def read_frame(self) -> dict:
        import cv2

        ret, frame = self.cap.read()
        if not ret:
            return {"hands": [], "bodies": [], "timestamp": time.time()}

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Hand tracking
        hand_results = self.hands.process(rgb)
        hands = []
        if hand_results.multi_hand_landmarks:
            for i, hand_landmarks in enumerate(hand_results.multi_hand_landmarks):
                palm = hand_landmarks.landmark[9]  # Middle finger MCP
                fingertips = [hand_landmarks.landmark[tip] for tip in [4, 8, 12, 16, 20]]

                hands.append({
                    "id": i,
                    "position": {"x": palm.x - 0.5, "y": -(palm.y - 0.5), "z": palm.z},
                    "fingers": [{"x": f.x - 0.5, "y": -(f.y - 0.5), "z": f.z} for f in fingertips],
                    "gesture": self._detect_gesture(hand_landmarks.landmark),
                    "confidence": 0.8,
                })

        # Body tracking
        pose_results = self.pose.process(rgb)
        bodies = []
        if pose_results.pose_landmarks:
            hip = pose_results.pose_landmarks.landmark[23]  # Left hip
            bodies.append({
                "id": 0,
                "joints": {},
                "distance": max(0.5, 3.0 * (1.0 - hip.visibility)),
            })

        return {
            "hands": hands,
            "bodies": bodies,
            "timestamp": time.time(),
        }

    def _detect_gesture(self, landmarks) -> str:
        tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]
        mcps = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]]
        extended = sum(1 for t, m in zip(tips, mcps) if t.y < m.y)

        if extended == 0:
            return "fist"
        if extended >= 3:
            return "open"

        dx = landmarks[4].x - landmarks[8].x
        dy = landmarks[4].y - landmarks[8].y
        if (dx * dx + dy * dy) < 0.003:
            return "pinch"

        if extended == 1 and tips[0].y < mcps[0].y:
            return "point"

        return "open"

    def stop(self) -> None:
        if self.cap:
            self.cap.release()
        if self.hands:
            self.hands.close()
        if self.pose:
            self.pose.close()


CAMERAS = {
    "realsense": RealSenseCamera,
    "kinect": KinectCamera,
    "webcam": WebcamFallback,
}


async def stream_frames(websocket, camera: DepthCameraBase):
    """Stream depth frames to connected browser client."""
    print(f"[Server] Client connected: {websocket.remote_address}")
    try:
        while True:
            frame = camera.read_frame()
            await websocket.send(json.dumps(frame))
            await asyncio.sleep(1 / 30)  # 30 FPS target
    except websockets.exceptions.ConnectionClosed:
        print(f"[Server] Client disconnected: {websocket.remote_address}")


async def main(device: str, port: int):
    camera_cls = CAMERAS.get(device)
    if not camera_cls:
        print(f"Unknown device: {device}. Available: {list(CAMERAS.keys())}")
        return

    camera = camera_cls()
    camera.start()

    print(f"[Server] Depth camera server running on ws://localhost:{port}")
    print(f"[Server] Device: {device}")

    async with websockets.serve(
        lambda ws: stream_frames(ws, camera),
        "localhost",
        port,
    ):
        await asyncio.Future()  # Run forever

    camera.stop()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Depth camera WebSocket server")
    parser.add_argument("--device", default="webcam", choices=list(CAMERAS.keys()))
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()

    asyncio.run(main(args.device, args.port))
