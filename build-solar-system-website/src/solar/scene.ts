// SOLAR SYSTEM · Three.js 场景控制器（渲染/交互/相机/动画）
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {
  BODIES, BODIES_BY_ID, K, ORBIT_T, ORDER, SPIN_T, TILTS,
  type BodyConfig,
} from './data';
import { disposeProcedural, proceduralTexture } from './procedural';
import { disposeAllTextures, get, initTextureStore, loadSelected, type Quality } from './textures';
import { earthNight, makeAtmosphere, makeClouds, makeSaturnRing } from './materials';

export interface BodyNode {
  cfg: BodyConfig;
  orbit: THREE.Group | null;
  holder: THREE.Group | null;
  body: THREE.Mesh | null;
  angle: number;
  clouds?: THREE.Mesh;
  ring?: THREE.Mesh;
  tiltG?: THREE.Group;
  drive?: THREE.Group;   // per-moon orbit driver around its host planet
}

export interface SolarCallbacks {
  onSelect?: (id: string | null, preset?: string) => void;
  onStatus?: (msg: string) => void;
  onError?: (msg: string | null) => void;
  onReady?: () => void;
}

export interface LayerState {
  clouds: boolean;
  atmo: boolean;
  night: boolean;
}

const OVERVIEW_POS = new THREE.Vector3(0, 6.5, 13.5);

export class SolarSystem {
  /* ---- 基础对象 ---- */
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private container: HTMLElement;
  private cb: SolarCallbacks;

  /* ---- 场景对象 ---- */
  private nodes: Record<string, BodyNode> = {};
  private sunMesh!: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  private sunGlow!: THREE.Sprite;
  private sunLight!: THREE.PointLight;
  private ambient!: THREE.AmbientLight;
  private sysGroup = new THREE.Group();
  private orbitLines: THREE.Line[] = [];
  private atmoMesh: THREE.Mesh | null = null;
  private labelEls: { el: HTMLButtonElement; obj: THREE.Object3D; id: string }[] = [];
  private systemId: string | null = null;   // planet whose system is currently framed
  private labLayer: HTMLDivElement;
  private crosshair: HTMLDivElement;
  private readout: HTMLDivElement;
  private uSunDir = { value: new THREE.Vector3(1, 0, 0) };
  private disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  /* ---- 状态 ---- */
  private currentId: string | null = null;
  private currentHl: string | null = null;
  private focused: { node: BodyNode; prev: THREE.Vector3 } | null = null;
  private followHold = false;
  private camAnim: {
    t0: number; dur: number;
    fromPos: THREE.Vector3; fromTgt: THREE.Vector3;
    offVec: THREE.Vector3; anchorNode: BodyNode | null;
    staticPos: THREE.Vector3 | null; staticTgt: THREE.Vector3 | null;
  } | null = null;

  playing = true;
  spinPlaying = true;
  orbitPlaying = true;
  timeScale = 1;
  showOrbits = true;
  showLabels = true;
  quality: Quality = 'high';

  /* ---- 加载状态 ---- */
  private statusEl: HTMLDivElement | null = null;
  private booted = false;
  private pendingAssets = 0;
  private pendingPeak = 1;
  private loadErrors: string[] = [];
  private reduceMotion = false;
  private isMobile = false;
  private disposed = false;

  /* ---- 复用临时向量 ---- */
  private _v = new THREE.Vector3();
  private _v2 = new THREE.Vector3();
  private ray = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private last = performance.now();
  private simOrbit = 0;
  private simSpin = 0;
  private rafId = 0;

  constructor(container: HTMLElement, fx: HTMLElement, cb: SolarCallbacks = {}) {
    this.container = container;
    this.cb = cb;
    this.isMobile = matchMedia('(max-width: 720px)').matches;
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* 渲染器 */
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.style.touchAction = 'none';
    container.appendChild(this.renderer.domElement);
    initTextureStore(this.renderer);

    /* 场景与相机 */
    this.scene.background = new THREE.Color(0x050505);
    this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.002, 3000);
    this.camera.position.copy(OVERVIEW_POS);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.01;
    this.controls.maxDistance = 300;
    this.controls.addEventListener('start', () => {
      this.camAnim = null;
      this.followHold = false;
    });

    /* FX 层（标签 / 十字线 / 读数） */
    this.labLayer = document.createElement('div');
    this.labLayer.className = 'fx-labels';
    fx.appendChild(this.labLayer);
    this.crosshair = document.createElement('div');
    this.crosshair.className = 'crosshair';
    this.crosshair.innerHTML = '<i></i><i></i>';
    fx.appendChild(this.crosshair);
    this.readout = document.createElement('div');
    this.readout.className = 'surf-readout';
    fx.appendChild(this.readout);

    this.buildStars();
    this.buildLights();
    this.buildSun();
    this.buildBodies();
    this.bindEvents();
    this.renderer.setAnimationLoop(this.frame);
  }

  /* ================= 构建 ================= */

  private track<T>(p: Promise<T>, label?: string): Promise<T> {
    this.pendingAssets++;
    this.pendingPeak = Math.max(this.pendingPeak, this.pendingAssets);
    this.showStatus(this.booted ? 'Loading surface…' : 'Preparing scene…');
    p.catch((e) => {
      this.loadErrors.push(String(e?.message || e));
      this.cb.onError?.(label ? `Failed to load "${label}"` : 'Failed to load surface assets');
    }).finally(() => {
      this.pendingAssets--;
      if (this.pendingAssets <= 0) {
        this.clearStatus();
        if (!this.booted) { this.booted = true; this.cb.onReady?.(); }
      }
    });
    return p;
  }

  private showStatus(msg: string) { this.statusEl?.setAttribute('data-msg', msg); this.cb.onStatus?.(msg); }
  private clearStatus() { this.statusEl?.removeAttribute('data-msg'); this.cb.onStatus?.(''); }

  private buildStars() {
    const N = 650, pos = new Float32Array(N * 3);
    const rng = (() => { let s = 20260914; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    for (let i = 0; i < N; i++) {
      const v = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize().multiplyScalar(900);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ color: 0xbfccdd, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.7 });
    this.disposables.push(g, m);
    this.scene.add(new THREE.Points(g, m));
  }

  private buildLights() {
    this.sunLight = new THREE.PointLight(0xfff2e0, 500, 0, 2);
    this.scene.add(this.sunLight);
    this.ambient = new THREE.AmbientLight(0x8899bb, 0.16);
    this.scene.add(this.ambient);
  }

  private glowTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,230,190,0.85)'); gr.addColorStop(0.4, 'rgba(255,180,110,0.22)'); gr.addColorStop(1, 'rgba(255,160,80,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  private buildSun() {
    const geo = new THREE.SphereGeometry(12 * K, 64, 48);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.disposables.push(geo, mat);
    this.sunMesh = new THREE.Mesh(geo, mat);
    this.track(get('sun', 'standard').then((t) => { this.sunMesh.material.map = t; this.sunMesh.material.needsUpdate = true; }), 'Sun');
    this.scene.add(this.sunMesh);

    const gt = this.glowTexture();
    this.disposables.push(gt);
    this.sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: gt, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    this.sunGlow.scale.setScalar(12 * K * 2.2);
    this.scene.add(this.sunGlow);
  }

  private boundingRadius(cfg: BodyConfig) {
    if (cfg.id === 'saturn') return 2.4 * cfg.R * K;
    return cfg.R * K;
  }

  /*
   * Click target radius. Distant bodies are inflated so they stay clickable,
   * but a moon's target is capped so it can never reach its host planet.
   */
  private pickRadius(cfg: BodyConfig, center: THREE.Vector3) {
    const r = this.boundingRadius(cfg);
    const dist = center.distanceTo(this.camera.position);
    const angular = dist * 0.018;
    if (cfg.of) {
      const cap = (cfg.orbitD ?? 1) * K * 0.4;
      return Math.min(Math.max(r * 1.4, Math.min(angular, r * 10)), cap);
    }
    return Math.max(r * 1.3, Math.min(angular, r * 30));
  }

  private isVisible(obj: THREE.Object3D | null): boolean {
    for (let o: THREE.Object3D | null = obj; o; o = o.parent) if (!o.visible) return false;
    return true;
  }

  /*
   * Analytic picking: score every visible body by how close the ray passes to its
   * centre relative to its own target size. Clicking a moon therefore wins over the
   * planet behind it, even though the planet has a much larger target.
   */
  private pickBody(clientX: number, clientY: number): string | null {
    this.mouse.set((clientX / innerWidth) * 2 - 1, -(clientY / innerHeight) * 2 + 1);
    this.ray.setFromCamera(this.mouse, this.camera);
    const origin = this.ray.ray.origin;
    const dir = this.ray.ray.direction;
    let best: string | null = null;
    let bestScore = Infinity;
    const c = new THREE.Vector3();
    for (const [id, n] of Object.entries(this.nodes)) {
      if (!n.body || !this.isVisible(n.body)) continue;
      n.body.getWorldPosition(c);
      if (c.clone().sub(origin).dot(dir) <= 0) continue;    // behind the camera
      const d = this.ray.ray.distanceToPoint(c);
      const R = this.pickRadius(n.cfg, c);
      if (d > R) continue;
      const score = d / R;
      if (score < bestScore) { bestScore = score; best = id; }
    }
    return best;
  }

  private stdTex(id: string, opt?: { srgb?: boolean; ext?: string }) {
    return get(id, 'standard', opt);
  }

  /** Surface map: a bundled texture when we have one, otherwise a procedural one */
  private surfaceTex(cfg: BodyConfig): Promise<THREE.Texture> {
    if (cfg.texStd) return this.stdTex(cfg.texStd);
    if (cfg.proc) return Promise.resolve(proceduralTexture(cfg.id, cfg.proc));
    return Promise.reject(new Error('no surface for ' + cfg.id));
  }

  /** 天体表面材质统一按 MeshStandardMaterial 访问 */
  private bodyMat(n: BodyNode): THREE.MeshStandardMaterial {
    return n.body!.material as THREE.MeshStandardMaterial;
  }

  private earthShader() {
    if (!this.nodes.earth?.body) return undefined;
    return this.bodyMat(this.nodes.earth).userData.shader as
      { uniforms: { atlasNight: { value: THREE.Texture }; atlasNightOn: { value: number } } } | undefined;
  }

  private buildBodies() {
    this.scene.add(this.sysGroup);

    for (const cfg of BODIES) {
      if (cfg.id === 'sun') { this.nodes.sun = { cfg, body: this.sunMesh, holder: null, orbit: null, angle: 0 }; continue; }

      const isMoon = !!cfg.of;
      const orbit = new THREE.Group();          // for planets: the heliocentric driver
      const holder = new THREE.Group();         // carries the body itself
      orbit.add(holder);

      const mat = new THREE.MeshStandardMaterial({
        roughness: cfg.type === 'gas' ? 0.75 : 0.92,
        metalness: 0,
      });
      this.track(this.surfaceTex(cfg).then((t) => {
        mat.map = t;
        if (cfg.bump) { mat.bumpMap = t; mat.bumpScale = cfg.bump; }
        mat.needsUpdate = true;
      }), cfg.name);

      // Bigger bodies and anything we can view close-up get denser geometry
      const seg = cfg.R >= 2 ? 96 : (isMoon ? 48 : 64);
      let body: THREE.Mesh;
      if (cfg.type === 'earth') {
        this.track(this.stdTex(cfg.night!).then((t) => { earthNight(mat, t, this.uSunDir); mat.needsUpdate = true; }), 'Earth night lights');
        body = new THREE.Mesh(new THREE.SphereGeometry(cfg.R * K, 96, 64), mat);
        this.track(this.stdTex(cfg.clouds!, { srgb: false }).then((t) => {
          const cl = makeClouds(cfg.R * K, t);
          holder.add(cl);
          this.nodes.earth.clouds = cl;
        }), 'Earth clouds');
        this.atmoMesh = makeAtmosphere(cfg.R * K, this.uSunDir);
        holder.add(this.atmoMesh);
      } else if (cfg.id === 'moon') {
        body = new THREE.Mesh(new THREE.SphereGeometry(cfg.R * K, 96, 64), mat);
      } else {
        body = new THREE.Mesh(new THREE.SphereGeometry(cfg.R * K, seg, Math.round(seg * 0.7)), mat);
      }
      body.castShadow = true;
      body.receiveShadow = true;
      if (TILTS[cfg.id]) body.rotation.z = THREE.MathUtils.degToRad(TILTS[cfg.id]);
      body.userData.bodyId = cfg.id;
      holder.add(body);

      this.nodes[cfg.id] = Object.assign(this.nodes[cfg.id] || {}, {
        cfg, orbit, holder, body, angle: Math.random() * Math.PI * 2,
      });

      if (cfg.ring) {
        const tiltG = new THREE.Group();
        tiltG.rotation.z = THREE.MathUtils.degToRad(27);
        holder.remove(body);
        tiltG.add(body);
        this.track(get('saturn_ring', 'standard', { ext: 'webp' }).then((t) => {
          const ring = makeSaturnRing(cfg.R * K, t);
          tiltG.add(ring);
          this.nodes.saturn.ring = ring;
        }), 'Saturn rings');
        holder.add(tiltG);
        this.nodes.saturn.tiltG = tiltG;
      }

      if (isMoon) {
        /* Moons ride their own driver group parented to the host planet's holder,
           so they orbit the planet while the planet orbits the Sun. */
        const host = this.nodes[cfg.of!];
        const drive = new THREE.Group();
        host.holder!.add(drive);
        drive.add(holder);
        holder.position.x = cfg.orbitD! * K;
        this.nodes[cfg.id].drive = drive;
        // `orbit` is unused for moons as a driver, but setSolo toggles it for visibility
        this.nodes[cfg.id].orbit = drive;
      } else {
        this.sysGroup.add(orbit);
        holder.position.x = cfg.orbitD! * K;
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 180; i++) {
          const a = i / 180 * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * cfg.orbitD! * K, 0, Math.sin(a) * cfg.orbitD! * K));
        }
        const ol = new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0x33405c, transparent: true, opacity: 0.4 }));
        this.sysGroup.add(ol);
        this.orbitLines.push(ol);
      }

    }
  }

  /* ================= 纹理质量 ================= */

  private applyQualityToBody(cfg: BodyConfig) {
    if (!cfg.texStd || !cfg.tiers.includes(this.quality)) return;
    const n = this.nodes[cfg.id];
    this.showStatus('Loading surface…');
    loadSelected('body-' + cfg.id, cfg.texStd, this.quality).then((t) => {
      if (!t || this.disposed) return;
      const mat = this.bodyMat(n);
      mat.map = t;
      if (cfg.bump) mat.bumpMap = t;
      mat.needsUpdate = true;
      this.clearStatus();
    });
    if (cfg.type === 'earth') {
      loadSelected('earth-night', cfg.night!, this.quality).then((t) => {
        if (!t || this.disposed) return;
        const u = this.earthShader()?.uniforms?.atlasNight;
        if (u) u.value = t;
        this.bodyMat(n).needsUpdate = true;
      });
      if (this.nodes.earth.clouds) {
        loadSelected('earth-clouds', cfg.clouds!, this.quality, { srgb: false }).then((t) => {
          if (!t || this.disposed) return;
          const cm = this.nodes.earth.clouds!.material as THREE.MeshStandardMaterial;
          cm.alphaMap = t;
          cm.needsUpdate = true;
        });
      }
    }
  }

  /* ================= 相机系统 ================= */

  private frameDistance(radius: number, fill: number) {
    const vf = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const hf = Math.atan(Math.tan(vf) * this.camera.aspect);
    const f = Math.min(vf, hf);
    return radius / (Math.tan(f) * fill);
  }

  private camOffset(dirKey: string, d: number, p: THREE.Vector3) {
    // 太阳位于原点时方向退化，使用固定观景方向
    const toSun = p.lengthSq() < 1e-9
      ? new THREE.Vector3(0.55, 0.38, 0.74).normalize()
      : p.clone().negate().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(up, toSun).normalize();
    switch (dirKey) {
      case 'lit': return toSun.multiplyScalar(d * 0.9).add(up.multiplyScalar(d * 0.28)).add(side.multiplyScalar(d * 0.22));
      case 'terminator': return toSun.multiplyScalar(d * 0.3).add(side.multiplyScalar(d * 0.92)).add(up.multiplyScalar(d * 0.22));
      case 'polar': return up.multiplyScalar(d * 0.95).add(side.multiplyScalar(d * 0.3)).add(toSun.multiplyScalar(d * 0.1));
      case 'limb': return side.multiplyScalar(d * 0.95).add(up.multiplyScalar(d * 0.10)).add(toSun.multiplyScalar(d * 0.15));
      case 'nightside': return toSun.multiplyScalar(-d * 0.85).add(side.multiplyScalar(d * 0.4)).add(up.multiplyScalar(d * 0.25));
      case 'detail': return toSun.multiplyScalar(d * 0.55).add(side.multiplyScalar(d * 0.7)).add(up.multiplyScalar(d * 0.35));
      default: return toSun.multiplyScalar(d * 0.62).add(side.multiplyScalar(d * 0.66)).add(up.multiplyScalar(d * 0.34));
    }
  }

  private easeOut(x: number) { return 1 - Math.pow(1 - x, 3); }

  private flyCamTo(pos: THREE.Vector3, target: THREE.Vector3, ms = 850) {
    const anchor = this.focused ? this.focused.node : null;
    const offVec = anchor ? pos.clone().sub(anchor.body!.getWorldPosition(new THREE.Vector3())) : pos.clone();
    if (this.reduceMotion || ms <= 0) {
      this.camera.position.copy(pos);
      this.controls.target.copy(target);
      if (this.focused) this.focused.prev.copy(this.focused.node.body!.getWorldPosition(new THREE.Vector3()));
      return;
    }
    this.followHold = true;
    this.camAnim = {
      t0: performance.now(), dur: ms,
      fromPos: this.camera.position.clone(),
      fromTgt: this.controls.target.clone(),
      offVec, anchorNode: anchor,
      staticPos: anchor ? null : pos.clone(),
      staticTgt: anchor ? null : target.clone(),
    };
  }

  /* ================= 选择 / 总览 ================= */

  private setSolo(id: string | null) {
    const sel = id ? this.nodes[id] : null;
    // When a moon is selected we frame its whole system: host planet + sibling moons
    const systemId = sel ? (sel.cfg.of ?? id) : null;
    this.systemId = systemId;

    for (const [k, n] of Object.entries(this.nodes)) {
      if (k === 'sun' || !n.orbit) continue;
      const keep = !id || k === id || k === systemId || n.cfg.of === systemId;
      n.orbit.visible = !!keep;
    }
    for (const ol of this.orbitLines) ol.visible = (id === null) && this.showOrbits;
    this.sunMesh.visible = true;
    this.sunGlow.visible = true;
    this.sunLight.intensity = 500;
    this.ambient.intensity = 0.16;
  }

  select(id: string, preset?: string) {
    const n = this.nodes[id];
    if (!n) return;
    this.currentId = id;
    this.currentHl = null;
    this.focused = { node: n, prev: n.body!.getWorldPosition(new THREE.Vector3()) };
    this.setSolo(id);
    this.applyQualityToBody(n.cfg);
    // 太阳用带黑边的远景构图（0.45 填充），避免"身处太阳中心"的压迫感
    // The Sun gets a wide framing; small moons are filled a little tighter
    const fill = n.cfg.id === 'sun' ? 0.45 : (n.cfg.of ? 0.76 : 0.7);
    const d = this.frameDistance(this.boundingRadius(n.cfg), fill);
    const p = n.body!.getWorldPosition(new THREE.Vector3());
    const off = this.camOffset(preset || 'default', d, p);
    this.flyCamTo(p.clone().add(off), p);
    this.cb.onSelect?.(n.cfg.id, preset);
  }

  overview() {
    this.currentId = null;
    this.currentHl = null;
    this.focused = null;
    this.setSolo(null);
    for (const cfg of BODIES) {
      if (cfg.texStd && cfg.tiers.length > 1 && this.nodes[cfg.id]) {
        get(cfg.texStd!, 'standard').then((t) => {
          if (this.disposed) return;
          const mat = this.bodyMat(this.nodes[cfg.id]);
          mat.map = t;
          mat.needsUpdate = true;
        }).catch(() => {});
      }
    }
    this.flyCamTo(OVERVIEW_POS.clone(), new THREE.Vector3(0, 0, 0));
    this.cb.onSelect?.(null);
  }

  /* 观察重点：切换相机预设并（对地球）打开对应图层 */
  runHighlight(cfg: BodyConfig, h: { id: string; camDir: string; layer?: 'clouds' | 'atmo' | 'night' }) {
    const active = this.currentHl !== h.id;
    this.currentHl = active ? h.id : null;
    if (h.layer === 'night') {
      const sh = this.earthShader();
      if (sh) sh.uniforms.atlasNightOn.value = 1;
    }
    if (h.layer === 'clouds' && this.nodes.earth?.clouds) this.nodes.earth.clouds.visible = true;
    if (h.layer === 'atmo' && this.atmoMesh) this.atmoMesh.visible = true;
    this.select(cfg.id, active ? h.camDir : 'default');
    return active;
  }

  getCurrentId() { return this.currentId; }
  getCurrentHl() { return this.currentHl; }

  getLayerState(): LayerState {
    const sh = this.earthShader();
    return {
      clouds: this.nodes.earth?.clouds?.visible ?? true,
      atmo: this.atmoMesh?.visible ?? true,
      night: sh ? sh.uniforms.atlasNightOn.value > 0 : true,
    };
  }

  setClouds(on: boolean) { if (this.nodes.earth?.clouds) this.nodes.earth.clouds.visible = on; }
  setAtmo(on: boolean) { if (this.atmoMesh) this.atmoMesh.visible = on; }
  setNight(on: boolean) {
    const sh = this.earthShader();
    if (sh) sh.uniforms.atlasNightOn.value = on ? 1 : 0;
  }

  step(dir: number) {
    const idx = ORDER.indexOf(this.currentId ?? '');
    const next = ORDER[(idx + dir + ORDER.length) % ORDER.length];
    this.select(next);
  }

  resetView() { if (this.focused) this.select(this.currentId!); else this.overview(); }

  /** 键盘拉近 / 拉远（f 为缩放系数） */
  dolly(f: number) {
    if (!this.currentId) { this.camera.position.multiplyScalar(f); return; }
    const n = this.nodes[this.currentId];
    if (!n?.body) return;
    const p = n.body.getWorldPosition(new THREE.Vector3());
    const off = this.camera.position.clone().sub(p).multiplyScalar(f);
    this.camera.position.copy(p.clone().add(off));
  }

  setPlaying(on: boolean) { this.playing = on; }
  setSpin(on: boolean) { this.spinPlaying = on; }
  setOrbit(on: boolean) { this.orbitPlaying = on; }
  setSpeed(v: number) { this.timeScale = v; }

  setOrbitLines(on: boolean) {
    this.showOrbits = on;
    for (const ol of this.orbitLines) ol.visible = this.focused ? false : on;
  }

  setLabels(on: boolean) { this.showLabels = on; }

  setQuality(q: Quality) {
    this.quality = q;
    if (this.focused && this.currentId) this.applyQualityToBody(BODIES_BY_ID[this.currentId]);
  }

  getProgress() { return this.booted ? 1 : Math.max(0, 1 - this.pendingAssets / this.pendingPeak); }
  getErrors() { return this.loadErrors; }

  /* ================= 交互 ================= */

  private downAt: { x: number; y: number } | null = null;

  private onPointerDown = (e: PointerEvent) => {
    this.downAt = { x: e.clientX, y: e.clientY };
  };

  /* Only treat it as a click if the pointer barely moved (so orbiting doesn't select) */
  private onPointerUp = (e: PointerEvent) => {
    const d = this.downAt;
    this.downAt = null;
    if (!d) return;
    if (Math.abs(e.clientX - d.x) > 4 || Math.abs(e.clientY - d.y) > 4) return;
    const id = this.pickBody(e.clientX, e.clientY);
    if (id) this.select(id);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') { this.crosshair.style.display = 'none'; this.readout.style.display = 'none'; return; }
    this.crosshair.style.display = '';
    this.crosshair.style.left = e.clientX + 'px';
    this.crosshair.style.top = e.clientY + 'px';
  };

  private onPointerLeave = () => {
    this.crosshair.style.display = 'none';
    this.readout.style.display = 'none';
  };

  private hoverTimer = 0;
  private hoverPending = false;
  private hoverMouse = new THREE.Vector2();

  private onPointerHover = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    this.hoverMouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    if (this.hoverPending) return;
    this.hoverPending = true;
    setTimeout(() => {
      this.hoverPending = false;
      if (this.disposed) return;
      this.ray.setFromCamera(this.hoverMouse, this.camera);
      const meshes = Object.values(this.nodes)
        .filter((n) => n.body && this.isVisible(n.body))
        .map((n) => n.body) as THREE.Mesh[];
      const hit = this.ray.intersectObjects(meshes, false)[0];
      if (hit) {
        const id = hit.object.userData.bodyId;
        const cfg = BODIES_BY_ID[id];
        const local = hit.object.worldToLocal(hit.point.clone());
        const lat = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(local.y / local.length(), -1, 1)));
        const lon = THREE.MathUtils.radToDeg(Math.atan2(local.z, local.x));
        this.readout.textContent = `LAT ${lat >= 0 ? '+' : ''}${lat.toFixed(1)}°  LON ${lon >= 0 ? '+' : ''}${lon.toFixed(1)}°  ${cfg ? cfg.name : id}`;
        this.readout.style.display = '';
      } else {
        this.readout.style.display = 'none';
      }
    }, 120);
  };

  private onResize = () => {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  };

  private bindEvents() {
    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', this.onPointerDown);
    dom.addEventListener('pointerup', this.onPointerUp);
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('pointermove', this.onPointerHover);
    dom.addEventListener('pointerleave', this.onPointerLeave);
    addEventListener('resize', this.onResize);
  }

  /* ================= 主循环 ================= */

  private frame = (now: number) => {
    if (this.disposed) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    if (this.playing && this.orbitPlaying) this.simOrbit += dt * this.timeScale;
    if (this.playing && this.spinPlaying) this.simSpin += dt * this.timeScale;

    const TWO_PI = Math.PI * 2;
    for (const [k, n] of Object.entries(this.nodes)) {
      if (k === 'sun') continue;
      if (n.cfg.of) {
        /* Moon: revolve around its planet; tidally locked ones keep one face inward */
        const dir = n.cfg.retrograde ? -1 : 1;
        const ang = dir * this.simOrbit * TWO_PI / ((n.cfg.T ?? 6) * 3);
        if (n.drive) n.drive.rotation.y = ang;
        n.body!.rotation.y = n.cfg.locked ? ang : this.simSpin * TWO_PI / 12;
      } else if (n.orbit) {
        n.orbit.rotation.y = this.simOrbit * TWO_PI / (ORBIT_T[k] * 2.5);
        n.body!.rotation.y = this.simSpin * TWO_PI / (SPIN_T[k] * 3);
      }
    }
    if (this.nodes.earth?.clouds) this.nodes.earth.clouds.rotation.y = this.simSpin * TWO_PI / 22;
    this.sunMesh.rotation.y = this.simSpin * TWO_PI / (SPIN_T.sun * 3);

    if (this.camAnim) {
      const k = this.easeOut(Math.min((now - this.camAnim.t0) / this.camAnim.dur, 1));
      const anchorNow = this.camAnim.anchorNode
        ? this.camAnim.anchorNode.body!.getWorldPosition(new THREE.Vector3())
        : null;
      const goal = anchorNow ? anchorNow.clone().add(this.camAnim.offVec) : this.camAnim.staticPos!;
      const goalT = anchorNow || this.camAnim.staticTgt!;
      this.camera.position.lerpVectors(this.camAnim.fromPos, goal, k);
      this.controls.target.lerpVectors(this.camAnim.fromTgt, goalT, k);
      if (k >= 1) {
        this.camAnim = null;
        this.followHold = false;
        if (this.focused) this.focused.prev.copy(this.focused.node.body!.getWorldPosition(new THREE.Vector3()));
      }
    }

    if (this.focused && !this.followHold) {
      this.focused.node.body!.getWorldPosition(this._v2);
      this.camera.position.add(this._v2.clone().sub(this.focused.prev));
      this.controls.target.copy(this._v2);
      this.focused.prev.copy(this._v2);
    }
    this.controls.update();

    this.nodes.earth.body!.getWorldPosition(this._v);
    this.uSunDir.value.copy(this._v).normalize().negate();

    /* 总览标签（含避叠） */
    const placed: [number, number][] = [];
    for (const { el, obj, id: lid } of this.labelEls) {
      const lcfg = BODIES_BY_ID[lid];
      /* Overview: star + planets only. Focused: the current system's planet and moons. */
      const vis = this.showLabels && (
        this.focused
          ? (lid === this.systemId || lcfg.of === this.systemId)
          : !lcfg.of
      );
      if (!vis) { el.style.display = 'none'; continue; }
      obj.getWorldPosition(this._v);
      this._v.project(this.camera);
      const maxDist = lcfg.of ? 400 : 90;
      const ok0 = this._v.z < 1 && obj.getWorldPosition(new THREE.Vector3()).distanceTo(this.camera.position) < maxDist;
      let x = 0, y = 0, ok = ok0;
      if (ok) {
        x = (this._v.x * 0.5 + 0.5) * innerWidth;
        y = (-this._v.y * 0.5 + 0.5) * innerHeight;
        for (const [px, py] of placed) {
          if (Math.abs(px - x) < 30 && Math.abs(py - y) < 18) { ok = false; break; }
        }
      }
      el.style.display = ok ? '' : 'none';
      if (ok) {
        placed.push([x, y]);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  /* ================= 标签 ================= */

  private makeLabel(cfg: BodyConfig, obj: THREE.Object3D) {
    const el = document.createElement('button');
    el.className = 'lbl';
    el.textContent = cfg.name;
    el.addEventListener('click', (e) => { e.stopPropagation(); this.select(cfg.id); });
    this.labLayer.appendChild(el);
    this.labelEls.push({ el, obj, id: cfg.id });
  }

  private buildLabels() {
    for (const cfg of BODIES) {
      if (cfg.id === 'sun') this.makeLabel(cfg, this.sunMesh);
      else if (this.nodes[cfg.id]) this.makeLabel(cfg, this.nodes[cfg.id].body!);
    }
  }

  /* 供 UI 在就绪后调用：建立总览标签 */
  initLabels() { if (this.labelEls.length === 0) this.buildLabels(); }

  /* ================= 销毁 ================= */

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    cancelAnimationFrame(this.rafId);
    clearTimeout(this.hoverTimer);
    const dom = this.renderer.domElement;
    dom.removeEventListener('pointerdown', this.onPointerDown);
    dom.removeEventListener('pointerup', this.onPointerUp);
    dom.removeEventListener('pointermove', this.onPointerMove);
    dom.removeEventListener('pointermove', this.onPointerHover);
    dom.removeEventListener('pointerleave', this.onPointerLeave);
    removeEventListener('resize', this.onResize);
    this.controls.dispose();

    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else if (m) m.dispose();
    });
    for (const d of this.disposables) d.dispose();
    this.disposables = [];
    disposeAllTextures();
    disposeProcedural();

    this.labLayer.remove();
    this.crosshair.remove();
    this.readout.remove();
    if (dom.parentNode === this.container) this.container.removeChild(dom);
    this.renderer.dispose();
  }
}
