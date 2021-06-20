export const textFragmentShader = `

uniform sampler2D TextTexture;
varying vec2 vertexUV;

void main() {
   gl_FragColor = texture2D(TextTexture, vertexUV * vec2(1., 1.1) ) * vec4(1., 1., 1., .8);
}
`;
