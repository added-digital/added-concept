// Ashima / Stefan Gustavson simplex 3D noise — public-domain, battle-tested.
// Shared by the background gradient and the displaced blob.
export const SIMPLEX_3D = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// ---- Background gradient (flowing fbm noise between two palette colors) ----
// Rendered as a fullscreen clip-space quad (planeGeometry(2,2) maps its
// vertices to -1..1 in x/y), so it always fills the entire canvas exactly,
// independent of camera, aspect ratio or perspective.
export const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const BG_FRAG = /* glsl */ `
${SIMPLEX_3D}
uniform float uTime;
uniform float uScroll;
uniform float uAspect;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec2  uPointer;
varying vec2  vUv;

float fbm(vec3 p){
  float amp = 0.5;
  float sum = 0.0;
  for(int i = 0; i < 5; i++){
    sum += amp * snoise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return sum;
}

void main(){
  vec2 uv = vUv;
  // aspect-correct the sampling coords so the noise never stretches
  vec2 cuv = vec2(uv.x * uAspect, uv.y);
  vec3 p = vec3(cuv * 2.4, uTime * 0.04 + uScroll * 0.7);
  p.xy += uPointer * 0.18;
  float n = fbm(p);
  float g = smoothstep(-0.7, 0.9, n + (uv.y - 0.5) * 1.1 + uScroll * 0.45);
  vec3 col = mix(uColorA, uColorB, g);
  // faint flowing filaments
  col += vec3(0.04) * smoothstep(0.85, 1.0, fbm(p * 3.0 + 4.0));
  // exposure: keep it vibrant but stop bright palettes blowing out behind text
  col *= 0.78;
  // vignette to keep edges calm behind text
  float d = distance(uv, vec2(0.5));
  col *= 1.0 - d * 0.85;
  gl_FragColor = vec4(col, 1.0);
}
`;

// ---- Displaced blob (icosahedron pushed along normals by noise) ----
export const BLOB_VERT = /* glsl */ `
${SIMPLEX_3D}
uniform float uTime;
uniform float uDistort;
uniform float uScroll;
varying float vDisp;
varying vec3  vNormalW;
varying vec3  vWorldPos;

void main(){
  float t = uTime * 0.25;
  float n1 = snoise(normal * 1.4 + t);
  float n2 = snoise(position * 2.2 + t * 0.7);
  float disp = (n1 * 0.65 + n2 * 0.35) * uDistort * (1.0 + uScroll * 0.7);
  vec3 displaced = position + normal * disp;
  vDisp = disp;
  vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = worldPos.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const BLOB_FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vDisp;
varying vec3  vNormalW;
varying vec3  vWorldPos;

void main(){
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - max(dot(V, normalize(vNormalW)), 0.0), 2.4);
  vec3 base = mix(uColorA, uColorB, smoothstep(-0.45, 0.45, vDisp));
  vec3 col = mix(base, uColorB, fres);
  col += fres * 0.28; // softer rim so bright palettes don't clip to white
  gl_FragColor = vec4(col, 1.0);
}
`;
