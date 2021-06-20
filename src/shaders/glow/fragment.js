export const fragmentShader = `
varying vec3 vectorNormal;

void main() {
  // float intensity = 1.05- dot(vectorNormal, vec3(0.0, 0.0, 1.0));
  float intensity = 1.4- dot(vectorNormal, vec3(.7, -.5, .90));
  vec3 atmosphere = vec3(0.1, 0.35, 0.8) * pow(intensity, 1.5);
  // vec3 atmosphere = vec3(1, 0.4, 0.8) * pow(intensity, 1.5);

  gl_FragColor = vec4(atmosphere + vec3(0.06, 0.06, .06), .5);
}
`;
