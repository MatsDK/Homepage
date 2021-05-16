export const atmosphereFragmentShader = `
varying vec3 vectorNormal;

void main() {
  float intensity = pow(0.37 - dot(vectorNormal, vec3(0, 0, 1)), 2.0); 

  vec4 col = vec4(0.3, 0.6, 1.0, intensity); 
  gl_FragColor = col;
}
`;
