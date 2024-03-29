varying vec2 vUv;
varying vec2 vUv1;

uniform vec2 uvRate1;
uniform vec2 uScale;

void main() {
    vec4 mvPosition = vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;

    vUv = uv;
    vec2 _uv = (uv - vec2(0.5)) / uScale;
    vUv1 = _uv;
    vUv1 *= uvRate1.xy;
    vUv1 += 0.5;
}