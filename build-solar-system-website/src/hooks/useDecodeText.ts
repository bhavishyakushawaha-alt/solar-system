import { useEffect, useRef } from 'react';

const GLYPHS = '01△▢▣◆◇#$%&*+=?';
const randGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Decode effect: scrambled glyphs settle into the final text one by one */
export function useDecodeText(text: string, duration = 320) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useRef(
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce.current || el.textContent === text) { el.textContent = text; return; }
    const n = text.length;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      let out = '';
      for (let i = 0; i < n; i++) {
        out += i / n < k ? text[i] : (text[i] === ' ' ? ' ' : randGlyph());
      }
      el.textContent = out;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return ref;
}
