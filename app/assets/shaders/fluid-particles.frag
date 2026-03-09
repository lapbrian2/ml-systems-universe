/**
 * Fluid Particle Fragment Shader
 *
 * Renders each particle as a soft, glowing sphere with:
 * - Radial falloff for glow effect
 * - Color shift based on disturbance (warm when disrupted)
 * - Additive blending compatibility
 */

uniform float uTime;
uniform float uDisturbance;
uniform vec3 uGlowColor;      // Base glow tint
uniform float uGlowIntensity;

varying vec3 vColor;
varying float vAlpha;
varying float vDistFromCenter;

void main() {
  // Circular particle with soft edge
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  // Soft glow falloff — exponential for that ethereal look
  float strength = 1.0 - dist * 2.0;
  strength = pow(strength, 1.8);

  // Color: blend between rest color and warm glow when disturbed
  vec3 warmShift = vec3(0.3, 0.1, -0.1); // Push toward warm on disturbance
  vec3 color = vColor + warmShift * uDisturbance;

  // Add glow tint
  color = mix(color, uGlowColor, uGlowIntensity * 0.3);

  // Pulse glow on disturbance
  float pulse = sin(uTime * 4.0 + vDistFromCenter * 2.0) * 0.5 + 0.5;
  float glowBoost = pulse * uDisturbance * 0.3;

  color += glowBoost;

  // Final alpha
  float alpha = strength * vAlpha;

  gl_FragColor = vec4(color * strength, alpha);
}
