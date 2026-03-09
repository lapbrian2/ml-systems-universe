/**
 * Fluid Particle Vertex Shader
 *
 * Drives the Anadol-like data sculpture behavior:
 * - Time-based organic displacement (Perlin-style)
 * - Force field response (hand tracking attractors/repellers)
 * - Size attenuation with depth
 * - Smooth transitions between rest and disturbed states
 */

uniform float uTime;
uniform float uPixelRatio;
uniform float uBaseSize;
uniform float uDisturbance;       // 0.0 = at rest, 1.0 = fully disrupted

// Force fields from hand tracking (up to 2 hands)
uniform vec3 uForcePosition0;     // World-space position of hand 0
uniform float uForceStrength0;    // Negative = repel, positive = attract
uniform float uForceRadius0;

uniform vec3 uForcePosition1;
uniform vec3 uForceStrength1Pad;  // x = strength, y = radius

attribute float aRestoreSpeed;    // Per-particle: how fast it returns to rest
attribute vec3 aVelocity;         // Per-particle: current velocity

varying vec3 vColor;
varying float vAlpha;
varying float vDistFromCenter;

// Simplified noise function
float hash(vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n = mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
  return n;
}

vec3 applyForceField(vec3 pos, vec3 forcePos, float strength, float radius) {
  vec3 delta = pos - forcePos;
  float dist = length(delta);

  if (dist < 0.001 || dist > radius) return vec3(0.0);

  // Inverse-square falloff with soft edge
  float falloff = 1.0 - smoothstep(0.0, radius, dist);
  falloff = falloff * falloff; // Quadratic falloff

  vec3 direction = normalize(delta);
  return direction * strength * falloff;
}

void main() {
  vec3 pos = position;

  // === Organic ambient motion (always active) ===
  float noiseScale = 0.5;
  float timeScale = 0.15;
  vec3 noiseInput = pos * noiseScale + uTime * timeScale;

  vec3 displacement;
  displacement.x = noise3D(noiseInput) - 0.5;
  displacement.y = noise3D(noiseInput + vec3(100.0)) - 0.5;
  displacement.z = noise3D(noiseInput + vec3(200.0)) - 0.5;

  // Scale ambient motion
  pos += displacement * 0.15;

  // === Force field response (hand tracking) ===
  vec3 forceDisplacement = vec3(0.0);
  forceDisplacement += applyForceField(pos, uForcePosition0, uForceStrength0, uForceRadius0);
  forceDisplacement += applyForceField(pos, uForcePosition1, uForceStrength1Pad.x, uForceStrength1Pad.y);

  // Apply force with disturbance factor
  pos += forceDisplacement * uDisturbance;

  // === Fluid ripple on disturbance ===
  float ripple = sin(length(pos.xz) * 8.0 - uTime * 3.0) * 0.05 * uDisturbance;
  pos.y += ripple;

  // === Transform ===
  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projected = projectionMatrix * viewPosition;

  gl_Position = projected;

  // Size: base + distance attenuation + disturbance swell
  float sizeMultiplier = 1.0 + uDisturbance * 0.5;
  gl_PointSize = uBaseSize * uPixelRatio * sizeMultiplier;
  gl_PointSize *= (1.0 / -viewPosition.z);
  gl_PointSize = max(gl_PointSize, 1.0);

  // Pass to fragment shader
  vColor = color;
  vDistFromCenter = length(pos.xz);

  // Alpha: fade distant particles, brighten near force fields
  float distAlpha = smoothstep(8.0, 2.0, -viewPosition.z);
  float forceAlpha = length(forceDisplacement) * 2.0;
  vAlpha = mix(0.6, 1.0, forceAlpha) * distAlpha;
}
