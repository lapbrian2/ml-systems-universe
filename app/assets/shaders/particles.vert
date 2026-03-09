/**
 * Gallery Particle Vertex Shader
 * Handles size attenuation and time-based displacement.
 */

uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

varying vec3 vColor;

void main() {
  vec3 pos = position;

  // Subtle wave displacement
  pos.x += sin(uTime * 0.5 + pos.y * 2.0) * 0.05;
  pos.y += cos(uTime * 0.3 + pos.z * 1.5) * 0.05;
  pos.z += sin(uTime * 0.4 + pos.x * 1.8) * 0.03;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Size attenuation
  gl_PointSize = uSize * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vColor = color;
}
