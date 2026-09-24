import { useEffect, useRef } from 'react';

import { cellForProgress, ditherDraw, ditherDrawWave } from '../solar/dither';
import { INTRO_IMG } from '../solar/textures';

interface IntroProps {
  reduceMotion: boolean;
  getProgress: () => number;
  onEnter: () => void;
}

/** Intro: dithered pixel Moon + loading-progress reveal + dissolve on enter */
export default function Intro({ reduceMotion, getProgress, onEnter }: IntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvasRef.current!;
    const status = statusRef.current!;
    const go = goRef.current!;
    const center = centerRef.current!;

    const img = new Image();
    img.src = INTRO_IMG;
    let ready = false;
    let finished = false;
    let dissolving = false;
    let entered = false;
    let progress = 0;
    let raf = 0;
    const t0 = performance.now();

    const fit = () => {
      // Draw at 0.66× resolution (CSS upscales) — invisible with dithering, smoother dissolve
      cv.width = Math.floor(innerWidth * 0.66);
      cv.height = Math.floor(innerHeight * 0.66);
    };
    fit();
    addEventListener('resize', fit);

    img.onload = () => {
      ready = true;
      const loop = (now: number) => {
        if (finished || dissolving) return;   // dloop owns drawing during dissolve
        progress = getProgress();
        const cell = reduceMotion ? 2 : cellForProgress(progress);
        const dx = 0.5 + Math.sin((now - t0) / 9000) * 0.03;
        const dy = 0.5 + Math.cos((now - t0) / 11000) * 0.03;
        ditherDraw(cv, img, { cell, levels: 4, exposure: 0.82, dx, dy });
        if (progress >= 1) {
          status.textContent = 'Ready · click to enter';
          go.classList.add('show');
        } else {
          status.textContent = `Preparing scene ${Math.round(progress * 100)}%`;
        }
        if (!reduceMotion) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    img.onerror = () => {
      status.textContent = 'Click to enter';
      go.classList.add('show');
    };

    function enter() {
      if (entered || !ready || progress < 1 || dissolving) return;
      entered = true;
      dissolving = true;
      go.disabled = true;
      // Fade text first, then dissolve the image cell by cell
      center.style.opacity = '0';
      center.style.transform = 'translateY(-10px)';
      center.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
      status.style.opacity = '0';
      status.style.transition = 'opacity 0.22s ease';
      const d0 = performance.now();
      const dur = reduceMotion ? 0 : 820;
      const dloop = (now: number) => {
        const k = dur === 0 ? 1 : Math.min(1, (now - d0) / dur);
        ditherDrawWave(cv, img, { cell: 4, levels: 4, exposure: 0.82, p: k });
        if (k < 1) {
          raf = requestAnimationFrame(dloop);
        } else {
          finished = true;
          cancelAnimationFrame(raf);
          onEnter();
        }
      };
      setTimeout(() => { raf = requestAnimationFrame(dloop); }, 200);
    }

    go.onclick = enter;

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', fit);
      img.onload = null;
      img.onerror = null;
    };
  }, [reduceMotion, getProgress, onEnter]);

  return (
    <div id="intro" aria-label="Intro">
      <canvas id="introBg" ref={canvasRef} />
      <div className="intro-center" ref={centerRef}>
        <div className="intro-brand-en">SOLAR SYSTEM</div>
        <h1 className="intro-title">The Living Solar System</h1>
        <p className="intro-poem">Ten bodies · one clear view</p>
        <button id="introGo" ref={goRef}>Start exploring <span aria-hidden="true">→</span></button>
      </div>
      <div className="intro-foot"><span id="introStatus" ref={statusRef}>Preparing scene…</span></div>
    </div>
  );
}
