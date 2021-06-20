export const textVertextShader = `
varying vec3 vectorNormal;
varying vec2 vertexUV;

void main() {
  vertexUV = uv;
  vectorNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);  
}
`;
