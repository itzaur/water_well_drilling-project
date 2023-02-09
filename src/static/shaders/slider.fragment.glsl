precision mediump float;

uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

uniform vec2 uPixels;
uniform vec2 uAccel;

varying vec2 vUv;
varying vec2 vUv1;

vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m));
}

float tri(float p) {
    return mix(p, 1.0 - p, step(0.5, p)) * 2.0;
}

float udRoundBox( vec2 p, vec2 b, float r ){
    return length(max(abs(p)-b+r,0.0))-r;
}

float roundCorners(vec2 planeRes, vec2 uv, float radius) {
    float iRadius = min(planeRes.x, planeRes.y) * radius;
    vec2 halfRes = 0.5 * planeRes.xy;
    float b = udRoundBox( (uv * planeRes) - halfRes, halfRes, iRadius );
    return clamp(1.0 - b, 0.0, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uPixels.xy;
    
    // float progress = fract(uProgress);

    float delayValue = uProgress * 7.0 - uv.y * 2.0 + uv.x - 2.0;
    delayValue = clamp(delayValue, 0.0, 1.0);

    vec2 translateValue = uProgress + delayValue * uAccel;
    vec2 translateValue1 = vec2(-0.5, 1.0) * translateValue;
    vec2 translateValue2 = vec2(-0.5, 1.0) * (translateValue - 1.0 - uAccel);

    vec2 wave = sin(sin(uTime) * vec2(0.0, 0.3) + vUv.yx * vec2(0.0, 4.0)) * vec2(0.0, 1.0);
    vec2 xy = wave * (tri(uProgress) * 0.5 + tri(delayValue) * 0.5);

    vec2 uv1 = vUv1 + translateValue1 + xy;
    vec2 uv2 = vUv1 + translateValue2 + xy;

    vec4 rgba1 = texture2D(uTexture1, mirrored(uv1));
    vec4 rgba2 = texture2D(uTexture2, mirrored(uv2));

    float edge = 0.5 * (uv.y + uv.x);
    float sm = 0.12;
    float str = smoothstep(edge - sm, edge + sm, uProgress);
    delayValue = str;

    vec4 rgba = mix(rgba1, rgba2, delayValue);
    
    gl_FragColor = rgba;
    // float roundC = roundCorners(vec2(1.0, 1.0), vUv1, 0.024);
   
}