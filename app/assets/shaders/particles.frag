/**
 * Gallery Particle Fragment Shader
 * Soft circular particles with glow falloff.
 */

varying vec3 vColor;

void main() {
  // Circular particle shape
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  // Soft glow falloff
  float strength = 1.0 - (dist * 2.0);
  strength = pow(strength, 1.5);

  vec3 color = vColor * strength;

  gl_FragColor = vec4(color, strength * 0.8);
}
