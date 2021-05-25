export const terrainFragmentShader = `
  varying vec3 uPos;

  void main() {
    // gl_FragColor = vec4(vec3(.1, .35, .8) * (vectorNormal * -.4) ,  0.8);
    // gl_FragColor = vec4(vec3(.1, .35, .8),  1.);
    gl_FragColor = vec4(vec3(.1, .35, .8),  uPos.y * .2);
  }
`;
