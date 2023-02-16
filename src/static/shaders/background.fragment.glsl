precision mediump float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec2 uMouse;
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

#define ENABLE_LIGHTING
#define ENABLE_SPECULAR

#define OFFSET_X 1
#define OFFSET_Y 1
#define DEPTH	 16.0

const float multiplier = 10.5;
const float zoomSpeed = 1.5;
const int layers = 3;
const float lightRadius = 3.5;

vec2 hash2(vec2 p) {
  vec2 o = texture2D(uNoise, (p + 0.5) / 256.0, -100.0).xy;
  return o;
}

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle), sin(_angle), -sin(_angle), cos(_angle));
}

vec3 texsample(in vec2 uv, in vec2 sampleOffset, in sampler2D sampler_u) {
  uv = (uv + sampleOffset);
  return texture2D(sampler_u, uv).xyz;
}

vec3 texsample(const int x, const int y, in vec2 fragCoord, in sampler2D sampler_u) {
  // vec2 uv = fragCoord.xy / uResolution.xy * 1024.;
  vec2 uv = ((gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x) + vec2(uTime * .2, abs(sin(uTime * 5.) * .01))) * 1024.;
  uv = (uv + vec2(x, y)) / 1024.;
  return texture2D(sampler_u, uv).xyz * 2.0 - 1.0;
}

// vec3 texsample(const int x, const int y, in vec2 fragCoord, in sampler2D sampler_u) {
//     vec2 uv = ((gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x) + vec2(uTime * 0.2, abs(sin(uTime * 5.0) * 0.01))) * 1024.0;
//     uv = (uv + vec2(x, y)) / 1024.0;
//     return texture2D(sampler_u, uv).xyz;
// }

vec3 texsample(const int x, const int y, in vec2 fragCoord) {
  return texsample(x, y, fragCoord, uMapNormal);
}

float luminance(vec3 c) {
  // return dot(c, c);
  return dot(c, vec3(.2126, .7152, .0722));
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

// vec3 normal(in vec2 uv, in sampler2D sampler_u, vec3 offset) {
//     float R = abs(luminance(texsample(uv, offset.xz, sampler_u)));
//     float L = abs(luminance(texsample(uv, -offset.xz, sampler_u)));
//     float D = abs(luminance(texsample(uv, offset.zy, sampler_u)));
//     float U = abs(luminance(texsample(uv, -offset.zy, sampler_u)));

//     float X = (L - R) * 0.5;
//     float Y = (U - D) * 0.5;

//     return normalize(vec3(X, Y, 1.0 / DEPTH));
// }

// vec3 normal(in vec2 fragCoord, in sampler2D sampler_u) {
//     float R = abs(luminance(texsample(OFFSET_X, 0, fragCoord, sampler_u)));
//     float L = abs(luminance(texsample(-OFFSET_X, 0, fragCoord, sampler_u)));
//     float D = abs(luminance(texsample(0, OFFSET_Y, fragCoord, sampler_u)));
//     float U = abs(luminance(texsample(0, -OFFSET_Y, fragCoord, sampler_u)));

//     float X = (L - R) * 0.5;
//     float Y = (U - D) * 0.5;

//     return normalize(vec3(X, Y, 1.0 / DEPTH));
// }
vec3 normal(in vec2 fragCoord, in sampler2D sampler_u) {
  float R = abs(luminance(texsample(OFFSET_X, 0, fragCoord, sampler_u)));
  float L = abs(luminance(texsample(-OFFSET_X, 0, fragCoord, sampler_u)));
  float D = abs(luminance(texsample(0, OFFSET_Y, fragCoord, sampler_u)));
  float U = abs(luminance(texsample(0, -OFFSET_Y, fragCoord, sampler_u)));

  float X = (L - R) * .5;
  float Y = (U - D) * .5;

  return normalize(vec3(X, Y, 1. / DEPTH));
}

vec3 normal(in vec2 fragCoord) {
  return normal(fragCoord, uMapNormal);
}

vec3 pxSize;

// void renderLava(out vec4 fragColor, in vec2 uv, in vec2 movement, in vec2 fragCoord) {
//     vec2 mouse = uMouse;
//     if(uMousemoved == false) {
//       mouse.x = sin(uTime * 2.) * 0.5;
//       mouse.y = cos(uTime) * 0.5;
//     }

//     pxSize = vec3(1.0 / uResolution, 0.0);
//     uv *= 1.0 + dot(uv, uv) * 0.3;

//     vec3 norm = normal(uv + movement, uMapNormal, pxSize);

//     #ifdef ENABLE_LIGHTING

//     vec3 lp = vec3(mouse.xy + movement, 0.2);
//     vec3 sp = vec3(uv + movement, 0.0);
//     vec3 ray = normalize(vec3(uv + movement, 1.0));

//     vec2 sampleDistance = vec2(0.008, 0.0);

//     vec3 c = texsample(uv + movement, vec2(0.0), uMapColor) * dot(norm, normalize(lp - sp)) * clamp(1.0 - length((mouse.xy - uv)) * 2.0, 0.0, 1.0) * 3.0;

//     #ifdef ENABLE_SPECULAR
//     float e = 16.0 * (1.0 - texsample(uv + movement, vec2(0.0), uMapRoughness).x);
//     vec3 ep = vec3(0.5, 0.5, 10.0) + vec3(movement, 0.0);

//     c += (pow(clamp(dot(normalize(reflect(lp - sp, norm)), normalize(sp - ep)), 0.0, 1.0), e) * (texsample(uv + movement, vec2(0.0), uMapRoughness).x)) * 0.1;

//     #endif

//     #else
//     vec3 c = norm;

//     #endif

//     fragColor = vec4(c.bgr, 1.0);
// }
void renderLava(out vec4 fragColor, in vec2 uv, in vec2 movement, in vec2 fragCoord) {
  vec2 mouse = uMouse;
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  vec2 um = uMouse.xy;

  if (uMousemoved == false) {
    mouse.x = sin(uTime * 2.0) * 0.5;
    mouse.y = cos(uTime) * 0.5;
  }

  pxSize = vec3(1. / uResolution, 0.0);
    // uv *= (1. + dot(uv, uv)*0.3);
  // uv *= 2.5;
  vec3 n = normal(uv + movement, uMapNormal, pxSize);

  #ifdef ENABLE_LIGHTING
  vec3 lp = vec3((mouse.xy) + movement, 0.2);
  vec3 sp = vec3(uv + movement, 0.);
  vec3 ray = normalize(vec3(uv + movement, 1.));

  vec2 sampleDistance = vec2(.008, 0.);

  vec3 c = texsample(uv + movement, vec2(0.), uMapColor) * dot(n, normalize(lp - sp)) * clamp(1. - length((mouse.xy - uv)) * lightRadius, 0., 1.) * 3.;
  // c *= c;

  #ifdef ENABLE_SPECULAR
  float e = 16. * (1. - texsample(uv + movement, sampleDistance, uMapRoughness).x);

  vec3 ep = vec3(.5, .5, 10.) + vec3(movement, 0.);

  // float specular = pow(max(dot(reflect(-lightV, normal), -ray), 0.), 52.) * shininess;

  c += (pow(clamp(dot(normalize(reflect(lp - sp, n)), normalize(sp - ep)), 0., 1.), e) * (texsample(uv + movement, vec2(0), uMapRoughness).x)) * 0.1;
  ;
  #endif 

  #else
  vec3 c = n;

  #endif /* ENABLE_LIGHTING */

  // vec3 yellow, magenta, green;
  // yellow.rg = vec2(1.0);
  // yellow[2] = 0.0;
  // magenta = yellow.rgb;
  // green.rgb = yellow.brg;

  vec3 color = vec3(0.38f, 0.14f, 0.92f);
  // float pct = abs(sin(uMouse.x));
  // c.r *= 0.996;
  // c.g *= 0.980;
  // c.b *= 0.483;
  // c.r *= 0.558;
  // c.g *= 0.623;
  // c.b *= 0.896;

  c.r *= uCol1;
  c.g *= uCol2;
  c.b *= uCol3;

  // c.r += 0.490;
  // c.g /= 1.9;
  // c.b *= 0.939;
  color = mix(c.rrg, c.bgr, 1.0);

  fragColor = vec4(color, 1.0);
  // fragColor *= vec4(color, 1.0);
    // fragColor = vec4(c.b - 0.0, c.r - 0.0, c.r - 0.0, 1.0);
  // fragColor *= vec4(c.bbb, 1.0);
  // fragColor *= vec4(c.rrr, 1.0);
  // fragColor += vec4(ray, 1.0);
}
  //rgr rgg rgb 
  //rrr rrg-желтый rrb
  //rbr rbg rbb
  //gbr gbg gbb
  //

void main() {
  // vec2 st = gl_FragCoord.xy / uResolution.xy;
  // vec2 um = uMouse.xy;
  // vec2 uv;
  // // float dist = distance(uMouse, gl_FragCoord.xy);

  // if (uResolution.x > uResolution.y) {
  //   uv = (gl_FragCoord.xy - (vec2(um.x, um.y))) / (uResolution.x);
  //   uv *= 3.0;
  // } else {
  //   uv = ((gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y * 1.0);
  //   uv *= 2.0;
  // }

  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
  // vec2 screen = gl_FragCoord.xy / uResolution.xy;
    // vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / (uResolution.y);
    // float bg = uv.y;
    // bg = 1.0 - abs(2.0 * bg - 1.0);
    // float sy = vec.y;
    // sy = 1.0 - abs(2.0 * sy - 1.0);
    // uv *= sy;
    // vec2 vec = uMouse.xy / uResolution.y;

    // vec2 st = gl_FragCoord.xy / uResolution.xy;
    // st.x *= uResolution.x / uResolution.y;
    // float lessCoord = min(uResolution.x, uResolution.y);
    // vec2 resRatio = uResolution / vec2(lessCoord);
    // vec2 uv = abs((gl_FragCoord.xy - uMouse) / uResolution * resRatio);
    // float screenX = gl_FragCoord.x / uResolution.x;
    // float screenY = gl_FragCoord.y / uResolution.y;

    // gl_FragColor = vec4(grad.x, grad.y, screenX, 1.0);
  // uv *= 2.5;
    // uv /= 1.3;
    // vec2 _uv = vUv;
    // _uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / max(uResolution.x, uResolution.y);
    // _uv *= 3.0;
  // vec2 movement = vec2(sin(uTime * .4) * .2, -uTime * .05);

  renderLava(gl_FragColor, uv, vec2(0.0), gl_FragCoord.xy);

  // vec3 colour = vec3(0.08f, 0.16f, 0.61f);

  // float opacity = 1.;
  // float opacity_sum = 1.;

  // for (int i = 1; i <= layers; i++) {
  //   colour += renderLayer(i, layers, uv, opacity, colour);
  //   opacity_sum += opacity;
  // }

  // colour *= opacity_sum;

  // gl_FragColor.rgb *= 1. - mix(vec3(0.), vec3(-1., -1., 0.), clamp(colour * 10., 0., 1.));
  // gl_FragColor.rgb += colour * 2. * clamp(length(uv), 0.5, 1.);

  // gl_FragColor += vec4(clamp(colour * 1., 0., 1.), 1.0);

  // gl_FragColor *= vec4(uv, 0.5, 0.1);

  // vec3 colour = vec3(0.);

  // gl_FragColor.rgb *= 1. - mix(vec3(0.), vec3(-1., -1., 0.), clamp(0.5 * 10., 0., 1.));
  // gl_FragColor.rgb += colour * 4. * clamp(length(uv), 0., 1.);

  // gl_FragColor += vec4(clamp(colour * 20., 0., 1.), 1.0);
}