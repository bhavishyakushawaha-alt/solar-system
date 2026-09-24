// 材质与光照修复：地球夜灯、受日照约束的大气、土星环（UV 按半径映射）
import * as THREE from 'three';

/* 世界太阳方向（太阳位于原点）：指向太阳 = -normalize(worldPos) */
export function sunDirWorld(worldPos: THREE.Vector3, out = new THREE.Vector3()) {
  return out.copy(worldPos).normalize().negate();
}

/*
 * earthNight：声明 atlasNight / atlasSun / atlasNightOn，
 * 在 emissivemap_fragment 之后把夜面城市灯光加入 totalEmissiveRadiance。
 * 夜灯是自发光，不混入白天 diffuse，因此不会被灯光压黑。
 */
export function earthNight(mat: THREE.MeshStandardMaterial, nightTex: THREE.Texture, sunDirUniform: { value: THREE.Vector3 }) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.atlasNight = { value: nightTex };
    sh.uniforms.atlasSun = sunDirUniform;              // vec3，世界空间指向太阳
    sh.uniforms.atlasNightOn = { value: 1.0 };
    sh.fragmentShader =
      'uniform sampler2D atlasNight;\nuniform vec3 atlasSun;\nuniform float atlasNightOn;\n' +
      sh.fragmentShader;
    sh.fragmentShader = sh.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      {
        vec3 wN = inverseTransformDirection(normalize(vNormal), viewMatrix);
        float nd = dot(wN, normalize(atlasSun));
        float nightF = 1.0 - smoothstep(-0.06, 0.12, nd);
        vec3 nightC = texture2D(atlasNight, vMapUv).rgb;
        totalEmissiveRadiance += nightC * nightF * atlasNightOn * 1.5;
      }`);
    mat.userData.shader = sh;
  };
}

/* 大气：1.025 壳层，Fresnel 边缘光 × 日照系数，避免整个球体泛蓝 */
export function makeAtmosphere(R: number, sunDirUniform: { value: THREE.Vector3 }) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.025, 48, 32),
    new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uSun: sunDirUniform },
      vertexShader: `
        varying vec3 vN; varying vec3 vP; varying vec3 vW;
        void main() {
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vP = mv.xyz;
          vW = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uSun;
        varying vec3 vN; varying vec3 vP; varying vec3 vW;
        void main() {
          float rim = pow(1.0 - abs(dot(normalize(vN), normalize(-vP))), 2.6);
          vec3 wN = normalize(vW);                    // 球心在原点：位置即法线近似
          float dayF = smoothstep(-0.25, 0.35, dot(wN, normalize(uSun)));
          float a = rim * (0.25 + 0.75 * dayF);       // 夜间仅保留微弱边缘
          gl_FragColor = vec4(0.30, 0.55, 1.0, 1.0) * a * 0.85;
        }`,
    }));
}

/* 地球云层：半径 1.006 透明壳，alphaMap 使用独立云图 */
export function makeClouds(R: number, alphaTex: THREE.Texture) {
  const m = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    alphaMap: alphaTex,
    transparent: true,
    depthWrite: false,
    roughness: 0.85,
    metalness: 0,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(R * 1.006, 48, 32), m);
}

/*
 * 土星环：先放 XZ 平面（与球体同处一个 tilt Group，统一倾斜 27°），
 * UV 按半径映射长条纹理（不用 RingGeometry 默认 UV）。
 * 双面、alphaTest .04、depthWrite=false、receiveShadow=true。
 */
export function makeSaturnRing(R: number, ringTex: THREE.Texture) {
  const seg = 128, bands = 3, rIn = 1.24 * R, rOut = 2.27 * R;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let b = 0; b <= bands; b++) {
    const rr = rIn + (rOut - rIn) * b / bands;
    for (let k = 0; k <= seg; k++) {
      const a = k / seg * Math.PI * 2;
      pos.push(Math.cos(a) * rr, 0, Math.sin(a) * rr);   // XZ 平面
      uv.push(b / bands, k / seg);                        // u = 半径比例
    }
  }
  for (let b = 0; b < bands; b++) for (let k = 0; k < seg; k++) {
    const a = b * (seg + 1) + k;
    idx.push(a, a + 1, a + seg + 1, a + 1, a + seg + 2, a + seg + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({
    map: ringTex,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.04,
    depthWrite: false,
    roughness: 0.85,
    metalness: 0,
  });
  const ring = new THREE.Mesh(g, m);
  ring.receiveShadow = true;
  return ring;
}
