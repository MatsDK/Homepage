export const terrainVertexShader = `
  varying vec3 uPos;

  void main() {
    uPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);  
  }
`;
