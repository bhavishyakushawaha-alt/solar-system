// TextureStore：按需加载、颜色空间、缓存、释放、异步防串台
import * as THREE from 'three';

import sunUrl from '../assets/tex/sun.webp';
import mercuryUrl from '../assets/tex/mercury.webp';
import venusUrl from '../assets/tex/venus_atmo.webp';
import earthDayUrl from '../assets/tex/earth_day.webp';
import earthNightUrl from '../assets/tex/earth_night.webp';
import earthCloudsUrl from '../assets/tex/earth_clouds.webp';
import moonUrl from '../assets/tex/moon.webp';
import marsUrl from '../assets/tex/mars.webp';
import jupiterUrl from '../assets/tex/jupiter.webp';
import saturnUrl from '../assets/tex/saturn.webp';
import uranusUrl from '../assets/tex/uranus.webp';
import neptuneUrl from '../assets/tex/neptune.webp';
import ioUrl from '../assets/tex/io.webp';
import europaUrl from '../assets/tex/europa.webp';
import ganymedeUrl from '../assets/tex/ganymede.webp';
import callistoUrl from '../assets/tex/callisto.webp';
import saturnRingUrl from '../assets/tex/saturn_ring.webp';

/** 标准档贴图（构建期内联为 data URL，保证单文件可用） */
export const STD_TEX: Record<string, string> = {
  sun: sunUrl,
  mercury: mercuryUrl,
  venus_atmo: venusUrl,
  earth_day: earthDayUrl,
  earth_night: earthNightUrl,
  earth_clouds: earthCloudsUrl,
  moon: moonUrl,
  mars: marsUrl,
  jupiter: jupiterUrl,
  saturn: saturnUrl,
  uranus: uranusUrl,
  neptune: neptuneUrl,
  io: ioUrl,
  europa: europaUrl,
  ganymede: ganymedeUrl,
  callisto: callistoUrl,
  saturn_ring: saturnRingUrl,
};

/** 开场用的月面贴图（data URL） */
export const INTRO_IMG = moonUrl;

const loader = new THREE.TextureLoader();
const cache = new Map<string, Promise<THREE.Texture>>();
const pendingTicket = new Map<string, number>();
let maxAniso = 8;

export function initTextureStore(renderer: THREE.WebGLRenderer) {
  maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
}

export type Quality = 'standard' | 'high' | 'ultra';

export function urlFor(id: string, quality: Quality, ext?: string): string {
  if (quality === 'high') return `./assets/hires/4k_${id}.jpg`;
  if (quality === 'ultra') return `./assets/hires/8k_${id}.jpg`;
  return STD_TEX[id] ?? `./assets/system/tex/${id}.${ext || 'webp'}`;
}

function applyCommon(tex: THREE.Texture, srgb: boolean) {
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = maxAniso;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function get(id: string, quality: Quality = 'standard', { srgb = true, ext }: { srgb?: boolean; ext?: string } = {}): Promise<THREE.Texture> {
  const url = urlFor(id, quality, ext);
  if (!cache.has(url)) {
    cache.set(url, new Promise((resolve, reject) => {
      loader.load(url,
        (t) => resolve(applyCommon(t, srgb)),
        undefined,
        () => { cache.delete(url); reject(new Error('Texture failed to load: ' + url)); },
      );
    }));
  }
  return cache.get(url)!;
}

/* 释放不在 keep 列表中的已完成纹理；pending 请求不误释放 */
export async function prune(keepUrls: string[] = []) {
  const keep = new Set(keepUrls);
  for (const [url, p] of [...cache.entries()]) {
    if (keep.has(url)) continue;
    let done = false;
    p.then(() => { done = true; }, () => { done = true; });
    // 已完成的才释放；未完成的等它落地后再判断
    p.then((t) => {
      if (!keep.has(url)) { t.dispose(); cache.delete(url); }
    }).catch(() => {});
    if (done) continue;
  }
}

/* 全部释放（用于场景销毁/重载） */
export function disposeAllTextures() {
  for (const [, p] of cache) p.then((t) => t.dispose()).catch(() => {});
  cache.clear();
  pendingTicket.clear();
}

/* 切槽防串台：同一槽位只有最新 ticket 的结果会被采用 */
export function loadSelected(slot: string, id: string, quality: Quality = 'standard', opt: { srgb?: boolean; ext?: string } = {}): Promise<THREE.Texture | null> {
  const ticket = (pendingTicket.get(slot) ?? 0) + 1;
  pendingTicket.set(slot, ticket);
  return get(id, quality, opt).then((t) => {
    if (pendingTicket.get(slot) !== ticket) return null;
    return t;
  }).catch(() => null);
}
