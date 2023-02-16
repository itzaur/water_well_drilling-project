precision mediump float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uScale;
uniform vec3 uColor;
uniform bool uMousemoved;
uniform float uTime;
uniform sampler2D uNoise;
uniform sampler2D uMapColor;
uniform sampler2D uMapNormal;
uniform sampler2D uMapRoughness;
uniform sampler2D uMapDisplacement;
uniform sampler2D uTexture1;
uniform float uCol1;
uniform float uCol2;
uniform float uCol3;
uniform float uRadius;
uniform float uLightIntensity;

#define ENABLE_LIGHTING
#define ENABLE_SPECULAR

#define OFFSET_X 1
#define OFFSET_Y 1
#define DEPTH	 16.0

vec3 texsample(in vec2 uv, in vec2 sampleOffset, in sampler2D sampler_u) {
  uv = (uv + sampleOffset);
    // uv = (vUv - vec2(0.5)) / uScale + vec2(0.5);
  return texture2D(sampler_u, uv).xyz;
}

float luminance(vec3 c) {
  return dot(c, vec3(0.6471, 0.2745, 1.0));
}

vec3 normal(in vec2 uv, in sampler2D sampler_u, vec3 offset) {
  float R = abs(luminance(texsample(uv, offset.xz, sampler_u)));
  float L = abs(luminance(texsample(uv, -offset.xz, sampler_u)));
  float D = abs(luminance(texsample(uv, offset.zy, sampler_u)));
  float U = abs(luminance(texsample(uv, -offset.zy, sampler_u)));

  float X = (L - R) * .5;
  float Y = (U - D) * .5;

  return normalize(vec3(X, Y, 1. / DEPTH));
}

vec3 pxSize;

void renderLava(out vec4 fragColor, in vec2 uv, in vec2 movement, in vec2 fragCoord) {
  vec2 mouse = uMouse;
  if (uMousemoved == false) {
    mouse.x += -1.0 + sin(uTime * 2.0) * 0.5;
    mouse.x += 1.0 + sin(uTime * 2.0) * 0.5;
    mouse.y = cos(uTime) * 1.0;
  }

  pxSize = vec3(1.0 / uResolution, 0.);

    // uv = (vUv - vec2(0.5)) / uScale + vec2(0.5);
  // uv *= 1.2;
  vec3 n = normal(uv + movement, uMapNormal, pxSize);

  #ifdef ENABLE_LIGHTING
  vec3 lp = vec3((mouse.xy) + movement, .2);
  vec3 sp = vec3(uv + movement, 0.);

  vec3 c = texsample(uv + movement, vec2(0.), uMapColor) * dot(n, normalize(lp - sp)) * clamp(1. - length((mouse.xy - uv)) * uRadius, 0.0, 1.0) * uLightIntensity;
  c *= texsample(uv + movement, vec2(0.), uMapDisplacement);

  // c *= c;

  #ifdef ENABLE_SPECULAR
  float e = 16. * (1. - texsample(uv + movement, vec2(0.), uMapRoughness).x);
    // e = 16.;
  vec3 ep = vec3(.5, .5, 10.) + vec3(movement, 0.);

    // float specular = pow(max(dot( reflect(-lightV, normal), -ray), 0.), 52.) * shininess;
  c += (pow(clamp(dot(normalize(reflect(lp - sp, n)), normalize(sp - ep)), 0., 1.), e) * (texsample(uv + movement, vec2(0.0), uMapRoughness).x)) * 0.1;

  #endif /* ENABLE_SPECULAR */

  #else
  vec3 c = n;

  #endif /* ENABLE_LIGHTING */

  vec3 color = vec3(0.78f, 0.71f, 0.95f);
  c.r *= uCol1;
  c.g *= uCol2;
  c.b *= uCol3;
  // c *= c;
  // c *= vec3(1.0, 1.0, 1.0);

  color *= c.bgr;
  // color = mix(c.bgr, c.grb, 1.0);

  fragColor = vec4(color, 1.0);
  // fragColor = vec4(c.bgr, 1.0);
  // color = mix(color0, color1, max(0.0, uNoise - 0.5) * 2.0);
  fragColor += vec4(uColor, 0.8);

}

void main() {
  // vec2 newUV = (vUv - vec2(0.5)) / uScale + vec2(0.5);
  vec2 newUV = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
  newUV *= 2.0;
  // vec4 color = texture2D(uMapColor, newUV);
  // gl_FragColor = color;

  renderLava(gl_FragColor, newUV, vec2(0.), gl_FragCoord.xy);
}