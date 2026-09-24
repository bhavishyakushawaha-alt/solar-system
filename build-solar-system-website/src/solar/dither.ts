// 1-bit Bayer 有序抖动（视频/图像采样 → 灰阶量化 → 抖动矩阵）
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function hashCell(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263) ^ (x * y * 1274126177);
  h = (h ^ (h >> 13)) * 1103515245;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

export interface DitherOpt {
  cell?: number;
  levels?: number;
  exposure?: number;
  drop?: number;
  dx?: number;
  dy?: number;
  p?: number;
}

/** 把图像按 1-bit 抖动画到目标 canvas。 */
export function ditherDraw(target: HTMLCanvasElement, img: HTMLImageElement, opt: DitherOpt = {}) {
  const cell = Math.max(1, opt.cell || 6);
  const levels = opt.levels || 4;
  const exposure = opt.exposure ?? 1.0;
  const drop = opt.drop ?? 0;   // 消散比例 0..1（按单元格确定性丢弃）
  const w = target.width, h = target.height;
  const ctx = target.getContext('2d', { willReadFrequently: true })!;

  // 源按色块数降采样
  const gw = Math.ceil(w / cell), gh = Math.ceil(h / cell);
  const small = document.createElement('canvas');
  small.width = gw; small.height = gh;
  const sctx = small.getContext('2d')!;
  // cover 式裁剪
  const ir = img.width / img.height, tr = gw / gh;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ir > tr) { sw = sh * tr; sx = (img.width - sw) * (opt.dx ?? 0.5); }
  else { sh = sw / tr; sy = (img.height - sh) * (opt.dy ?? 0.5); }
  sctx.drawImage(img, sx, sy, sw, sh, 0, 0, gw, gh);
  const data = sctx.getImageData(0, 0, gw, gh).data;

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#f3efe7';
  const step = 1 / (levels + 1);
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const i = (y * gw + x) * 4;
      let g = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
      g = Math.min(1, Math.max(0, g * exposure));
      if (drop > 0 && hashCell(x, y) < drop) continue;
      const t = (BAYER[y % 4][x % 4] + 0.5) / 16;
      // 量化到 levels 级后与抖动阈值比较
      const q = Math.round(g / step) * step;
      if (q > t) ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
}

/** 由进度计算显影色块尺寸：粗 → 细 */
export function cellForProgress(p: number, coarse = 14, fine = 1.5) {
  const k = Math.min(1, Math.max(0, p));
  return coarse + (fine - coarse) * (k * k * (3 - 2 * k)); // smoothstep
}

/** 数字矩阵波动式消散：斜向波前扫过，像素块随波动缩放熄灭。 */
export function ditherDrawWave(target: HTMLCanvasElement, img: HTMLImageElement, opt: DitherOpt = {}) {
  const cell = Math.max(2, opt.cell || 4);
  const levels = opt.levels || 4;
  const exposure = opt.exposure ?? 0.82;
  const p = opt.p ?? 0;
  const w = target.width, h = target.height;
  const ctx = target.getContext('2d', { willReadFrequently: true })!;

  const gw = Math.ceil(w / cell), gh = Math.ceil(h / cell);
  const small = document.createElement('canvas');
  small.width = gw; small.height = gh;
  const sctx = small.getContext('2d')!;
  const ir = img.width / img.height, tr = gw / gh;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ir > tr) { sw = sh * tr; sx = (img.width - sw) * 0.5; }
  else { sh = sw / tr; sy = (img.height - sh) * 0.5; }
  sctx.drawImage(img, sx, sy, sw, sh, 0, 0, gw, gh);
  const data = sctx.getImageData(0, 0, gw, gh).data;

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#f3efe7';
  const step = 1 / (levels + 1);
  const waveSpan = 0.22;
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const i = (y * gw + x) * 4;
      let g = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
      g = Math.min(1, Math.max(0, g * exposure));
      const t = (BAYER[y % 4][x % 4] + 0.5) / 16;
      const q = Math.round(g / step) * step;
      if (q <= t) continue;
      // 波前位置：对角线扫描 + 单元格随机微扰
      const pos = (x / gw + y / gh) / 2 + hashCell(x, y) * 0.08;
      const local = Math.min(1, Math.max(0, (p * (1 + waveSpan) - pos) / waveSpan));
      if (local >= 1) continue;
      const s = 1 - local;
      if (s <= 0.02) continue;
      ctx.globalAlpha = 1 - local * 0.85;
      const sz = cell * s;
      ctx.fillRect(x * cell + (cell - sz) / 2, y * cell + (cell - sz) / 2, sz, sz);
    }
  }
  ctx.globalAlpha = 1;
}
