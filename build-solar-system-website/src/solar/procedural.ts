// Procedural surface textures for bodies that have no photographic map.
// Everything is generated once on a canvas and cached as a THREE texture.
import * as THREE from 'three';

export type ProcStyle = 'cratered' | 'icy' | 'haze' | 'streaked' | 'twotone';

export interface ProcSpec {
  style: ProcStyle;
  base: string;      // main surface colour
  accent?: string;   // crater floors / band / dark hemisphere
  craters?: number;  // crater count for cratered / icy
  seed?: number;
}

const cache = new Map<string, THREE.Texture>();

/* Small deterministic RNG so a body always looks the same */
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

/** Soft mottling so the surface is never a flat colour */
function mottle(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number, base: [number, number, number], strength: number) {
  for (let i = 0; i < 420; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = (0.02 + rand() * 0.10) * w;
    const dark = rand() < 0.5;
    const target: [number, number, number] = dark ? [0, 0, 0] : [255, 255, 255];
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, mix(base, target, strength * (0.35 + rand() * 0.5)));
    g.addColorStop(1, `rgba(${base[0]},${base[1]},${base[2]},0)`);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Impact craters: dark floor, bright sunward rim */
function craters(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number, base: [number, number, number], accent: [number, number, number], count: number) {
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    // Smaller craters near the poles so the UV stretch stays believable
    const lat = Math.abs(y / h - 0.5) * 2;
    const r = (0.004 + Math.pow(rand(), 2.4) * 0.05) * w * (1 - lat * 0.55);
    if (r < 1.2) continue;
    const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
    g.addColorStop(0, mix(base, accent, 0.65));
    g.addColorStop(0.72, mix(base, accent, 0.4));
    g.addColorStop(0.92, mix(base, [255, 255, 255], 0.30));
    g.addColorStop(1, `rgba(${base[0]},${base[1]},${base[2]},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function proceduralTexture(id: string, spec: ProcSpec): THREE.Texture {
  const cached = cache.get(id);
  if (cached) return cached;

  const w = 1024, h = 512;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d')!;
  const rand = rng(spec.seed ?? 1337);
  const base = hexToRgb(spec.base);
  const accent = hexToRgb(spec.accent ?? '#2a2622');

  ctx.fillStyle = spec.base;
  ctx.fillRect(0, 0, w, h);

  if (spec.style === 'cratered' || spec.style === 'icy') {
    mottle(ctx, w, h, rand, base, spec.style === 'icy' ? 0.22 : 0.38);
    craters(ctx, w, h, rand, base, accent, spec.craters ?? 160);
    if (spec.style === 'icy') {
      // Bright fracture lines across the ice shell
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 26; i++) {
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + rand() * 0.12})`;
        ctx.beginPath();
        let x = rand() * w, y = rand() * h;
        ctx.moveTo(x, y);
        for (let k = 0; k < 7; k++) {
          x += (rand() - 0.5) * w * 0.22;
          y += (rand() - 0.5) * h * 0.14;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  } else if (spec.style === 'haze') {
    // Smooth latitude bands, e.g. Titan's hazy atmosphere
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const band = Math.sin(t * Math.PI * 7) * 0.05 + Math.sin(t * Math.PI * 2.2) * 0.07;
      const polar = Math.pow(Math.abs(t - 0.5) * 2, 2.2) * 0.35;
      ctx.fillStyle = mix(base, accent, Math.max(0, band + polar));
      ctx.fillRect(0, y, w, 1);
    }
    mottle(ctx, w, h, rand, base, 0.12);
  } else if (spec.style === 'streaked') {
    // "Cantaloupe" dimpled terrain, e.g. Triton
    mottle(ctx, w, h, rand, base, 0.20);
    for (let i = 0; i < 260; i++) {
      const x = rand() * w, y = rand() * h;
      const r = (0.012 + rand() * 0.03) * w;
      ctx.strokeStyle = `rgba(255,255,255,${0.05 + rand() * 0.10})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.72, rand() * Math.PI, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Southern polar cap of nitrogen frost
    const cap = ctx.createLinearGradient(0, h * 0.62, 0, h);
    cap.addColorStop(0, 'rgba(255,245,235,0)');
    cap.addColorStop(1, 'rgba(255,248,240,0.45)');
    ctx.fillStyle = cap;
    ctx.fillRect(0, h * 0.62, w, h * 0.38);
  } else if (spec.style === 'twotone') {
    // One dark leading hemisphere, e.g. Iapetus
    mottle(ctx, w, h, rand, base, 0.18);
    craters(ctx, w, h, rand, base, accent, spec.craters ?? 120);
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0.00, 'rgba(0,0,0,0.00)');
    grad.addColorStop(0.16, 'rgba(24,16,10,0.72)');
    grad.addColorStop(0.42, 'rgba(24,16,10,0.80)');
    grad.addColorStop(0.68, 'rgba(24,16,10,0.10)');
    grad.addColorStop(1.00, 'rgba(0,0,0,0.00)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  cache.set(id, tex);
  return tex;
}

export function disposeProcedural() {
  for (const t of cache.values()) t.dispose();
  cache.clear();
}
