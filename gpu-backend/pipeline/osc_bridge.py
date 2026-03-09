"""
TouchDesigner OSC Bridge

Bridges between TouchDesigner and the gallery WebSocket protocol.
TouchDesigner sends OSC messages → this script translates to the
same JSON format the browser expects via WebSocket.

This allows hybrid installations where TouchDesigner handles
projection mapping and visual effects while the browser/Nuxt app
handles the generative AI pipeline.

Usage:
    python osc_bridge.py --osc-port 9000 --ws-port 8765

TouchDesigner Setup:
    1. Add an OSC Out CHOP pointed at localhost:9000
    2. Send hand data as: /hand/0/position x y z
    3. Send gesture as:   /hand/0/gesture "open"|"fist"|"pinch"|"point"
    4. Send body as:      /body/0/distance meters

The bridge also listens for generation results from the GPU server
and forwards them back to TouchDesigner via OSC for texture mapping
onto projection surfaces.
"""

import argparse
import asyncio
import json
import time

try:
    from pythonosc import dispatcher, osc_server, udp_client
    import websockets
except ImportError:
    print("pip install python-osc websockets")
    raise


class OSCBridge:
    """Translates OSC from TouchDesigner into WebSocket frames."""

    def __init__(self, osc_port: int, ws_port: int, td_osc_port: int):
        self.osc_port = osc_port
        self.ws_port = ws_port
        self.td_osc_port = td_osc_port

        # Current state
        self.hands: dict[int, dict] = {}
        self.bodies: dict[int, dict] = {}

        # WebSocket clients
        self.ws_clients: set = set()

        # OSC client to send back to TouchDesigner
        self.td_client = udp_client.SimpleUDPClient("127.0.0.1", td_osc_port)

    def setup_osc_handlers(self, disp: dispatcher.Dispatcher):
        """Register OSC message handlers."""

        # Hand tracking
        disp.map("/hand/*/position", self._on_hand_position)
        disp.map("/hand/*/gesture", self._on_hand_gesture)
        disp.map("/hand/*/fingers/*", self._on_hand_finger)

        # Body tracking
        disp.map("/body/*/distance", self._on_body_distance)
        disp.map("/body/*/present", self._on_body_present)

        # Generation triggers from TD
        disp.map("/generate/trigger", self._on_generate_trigger)

        # Catch-all for debugging
        disp.set_default_handler(self._on_default)

    def _parse_id(self, address: str) -> int:
        """Extract ID from OSC address like /hand/0/position → 0"""
        parts = address.strip("/").split("/")
        for part in parts:
            if part.isdigit():
                return int(part)
        return 0

    def _on_hand_position(self, address: str, *args):
        hand_id = self._parse_id(address)
        if len(args) >= 3:
            if hand_id not in self.hands:
                self.hands[hand_id] = {
                    "id": hand_id, "position": {}, "fingers": [],
                    "gesture": None, "confidence": 0.9,
                }
            self.hands[hand_id]["position"] = {
                "x": float(args[0]),
                "y": float(args[1]),
                "z": float(args[2]),
            }

    def _on_hand_gesture(self, address: str, *args):
        hand_id = self._parse_id(address)
        if hand_id in self.hands and args:
            self.hands[hand_id]["gesture"] = str(args[0])

    def _on_hand_finger(self, address: str, *args):
        # /hand/0/fingers/0 x y z
        hand_id = self._parse_id(address)
        if hand_id in self.hands and len(args) >= 3:
            finger = {"x": float(args[0]), "y": float(args[1]), "z": float(args[2])}
            fingers = self.hands[hand_id].setdefault("fingers", [])
            fingers.append(finger)
            if len(fingers) > 5:
                fingers.pop(0)

    def _on_body_distance(self, address: str, *args):
        body_id = self._parse_id(address)
        if args:
            self.bodies[body_id] = {
                "id": body_id,
                "joints": {},
                "distance": float(args[0]),
            }

    def _on_body_present(self, address: str, *args):
        body_id = self._parse_id(address)
        if args and not bool(args[0]):
            self.bodies.pop(body_id, None)

    def _on_generate_trigger(self, address: str, *args):
        """TouchDesigner can trigger generation directly via OSC."""
        # This gets picked up by the WebSocket client in the browser
        pass

    def _on_default(self, address: str, *args):
        pass  # Silently ignore unknown messages

    def build_frame(self) -> dict:
        """Build a WebSocket frame from current OSC state."""
        return {
            "hands": list(self.hands.values()),
            "bodies": list(self.bodies.values()),
            "timestamp": time.time(),
        }

    def send_to_touchdesigner(self, result: dict):
        """
        Forward generation results back to TouchDesigner via OSC.
        TD can then use these as textures for projection mapping.
        """
        if "image" in result:
            # Signal that a new image is ready
            self.td_client.send_message("/gallery/image/ready", 1)
            self.td_client.send_message("/gallery/image/width", result.get("width", 512))
            self.td_client.send_message("/gallery/image/height", result.get("height", 512))
            self.td_client.send_message("/gallery/elapsed", result.get("elapsed_seconds", 0))

        if "volume" in result:
            vol = result["volume"]
            self.td_client.send_message("/gallery/volume/ready", 1)
            self.td_client.send_message("/gallery/volume/points", vol.get("point_count", 0))

    async def ws_handler(self, websocket):
        """Handle a WebSocket client connection."""
        self.ws_clients.add(websocket)
        print(f"[OSC Bridge] Browser connected: {websocket.remote_address}")
        try:
            async for message in websocket:
                # Browser might send generation results back
                try:
                    data = json.loads(message)
                    if "image" in data:
                        self.send_to_touchdesigner(data)
                except json.JSONDecodeError:
                    pass
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.ws_clients.discard(websocket)
            print(f"[OSC Bridge] Browser disconnected")

    async def broadcast_loop(self):
        """Send frames to all connected WebSocket clients at 30fps."""
        while True:
            if self.ws_clients:
                frame = self.build_frame()
                message = json.dumps(frame)
                dead = set()
                for ws in self.ws_clients:
                    try:
                        await ws.send(message)
                    except websockets.exceptions.ConnectionClosed:
                        dead.add(ws)
                self.ws_clients -= dead
            await asyncio.sleep(1 / 30)


async def main(osc_port: int, ws_port: int, td_osc_port: int):
    bridge = OSCBridge(osc_port, ws_port, td_osc_port)

    # OSC server (receives from TouchDesigner)
    disp = dispatcher.Dispatcher()
    bridge.setup_osc_handlers(disp)
    osc = osc_server.AsyncIOOSCUDPServer(
        ("0.0.0.0", osc_port), disp, asyncio.get_event_loop()
    )
    transport, _ = await osc.create_serve_endpoint()

    print(f"[OSC Bridge] Listening for TouchDesigner on UDP port {osc_port}")
    print(f"[OSC Bridge] Sending back to TouchDesigner on UDP port {td_osc_port}")
    print(f"[OSC Bridge] WebSocket server on ws://localhost:{ws_port}")

    # WebSocket server (sends to browser)
    async with websockets.serve(bridge.ws_handler, "localhost", ws_port):
        await bridge.broadcast_loop()

    transport.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TouchDesigner OSC ↔ WebSocket bridge")
    parser.add_argument("--osc-port", type=int, default=9000, help="OSC receive port")
    parser.add_argument("--ws-port", type=int, default=8765, help="WebSocket server port")
    parser.add_argument("--td-port", type=int, default=9001, help="OSC send-back port to TD")
    args = parser.parse_args()

    asyncio.run(main(args.osc_port, args.ws_port, args.td_port))
