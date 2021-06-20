export const terrainVertexShader = `
  varying vec3 uPos;

  void main() {
    vec3 newpos = vec3(position);
    uPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.);  
  }
`;
