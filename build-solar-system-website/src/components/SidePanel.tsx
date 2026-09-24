import { useEffect, useRef } from 'react';

import { BODIES_BY_ID, MOONS_OF } from '../solar/data';
import type { Quality } from '../solar/textures';
import type { LayerState } from '../solar/scene';
import type { BodyConfig, Highlight } from '../solar/data';

export type PanelMode = 'settings' | 'details';

interface SidePanelProps {
  mode: PanelMode;
  open: boolean;
  currentId: string | null;
  currentHl: string | null;
  playing: boolean;
  spin: boolean;
  orbit: boolean;
  speed: number;
  labels: boolean;
  quality: Quality;
  layers: LayerState;
  onClose: () => void;
  onTogglePlay: () => void;
  onToggleSpin: () => void;
  onToggleOrbit: () => void;
  onSpeed: (v: number) => void;
  onPreset: (dir: string) => void;
  onToggleLabels: () => void;
  onToggleLayer: (layer: 'clouds' | 'atmo' | 'night') => void;
  onQuality: (q: Quality) => void;
  onHighlight: (cfg: BodyConfig, h: Highlight) => void;
  onSelectBody: (id: string) => void;
}

/** Pixel reveal mask for the panel header */
function pixelReveal(container: HTMLElement | null) {
  if (!container) return;
  const rect = container.getBoundingClientRect();
  if (rect.width < 10) return;
  const mask = document.createElement('div');
  mask.className = 'pxreveal';
  const cell = 12, cols = Math.ceil(rect.width / cell), rows = Math.ceil(rect.height / cell);
  mask.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  mask.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  for (let i = 0; i < cols * rows; i++) {
    const d = document.createElement('div');
    d.style.transitionDelay = `${Math.random() * 320}ms`;
    mask.appendChild(d);
  }
  container.appendChild(mask);
  requestAnimationFrame(() => requestAnimationFrame(() => mask.classList.add('go')));
  setTimeout(() => mask.remove(), 700);
}

/** Right slide-out panel: display settings / body profile */
export default function SidePanel(props: SidePanelProps) {
  const {
    mode, open, currentId, currentHl,
    playing, spin, orbit, speed, labels, quality, layers,
    onClose, onTogglePlay, onToggleSpin, onToggleOrbit, onSpeed, onPreset,
    onToggleLabels, onToggleLayer, onQuality, onHighlight, onSelectBody,
  } = props;

  const headRef = useRef<HTMLDivElement>(null);
  const lastMode = useRef<PanelMode | null>(null);

  useEffect(() => {
    if (open && lastMode.current !== mode) {
      lastMode.current = mode;
      const t = setTimeout(() => pixelReveal(headRef.current), 30);
      return () => clearTimeout(t);
    }
    if (!open) lastMode.current = null;
  }, [open, mode]);

  const cfg = currentId ? BODIES_BY_ID[currentId] : null;
  const host = cfg?.of ? BODIES_BY_ID[cfg.of] : null;
  const moons = cfg ? (MOONS_OF[cfg.id] ?? []) : [];

  return (
    <aside id="panel" className={open ? 'open' : ''} hidden={!open} aria-label="Panel">
      <div className="panel-head" ref={headRef}>
        <h2>{mode === 'settings' ? 'DISPLAY SETTINGS' : 'BODY PROFILE'}</h2>
        <button id="close-panel" aria-label="Close panel" onClick={onClose}>×</button>
      </div>
      <div id="panel-body">
        {mode === 'settings' ? (
          <>
            <h3>OBSERVATION</h3>
            <div className="row"><span>Pause all</span>
              <button className="chip" aria-pressed={!playing} onClick={onTogglePlay}>{playing ? 'Pause' : 'Play'}</button>
            </div>
            <div className="row"><span>Rotation</span>
              <button className="chip" aria-pressed={spin} onClick={onToggleSpin}>{spin ? 'On' : 'Off'}</button>
            </div>
            <div className="row"><span>Orbital motion</span>
              <button className="chip" aria-pressed={orbit} onClick={onToggleOrbit}>{orbit ? 'On' : 'Off'}</button>
            </div>
            <div className="row"><span>Time speed</span>
              <input type="range" min="0" max="4" step="0.1" value={speed} aria-label="Time speed"
                onChange={(e) => onSpeed(parseFloat(e.target.value))} />
            </div>
            <div className="row"><span>Camera preset</span>
              <span>
                <button className="chip" onClick={() => onPreset('lit')}>Sunlit</button>{' '}
                <button className="chip" onClick={() => onPreset('terminator')}>Terminator</button>
              </span>
            </div>
            <div className="row"><span>Labels</span>
              <button className="chip" aria-pressed={labels} onClick={onToggleLabels}>{labels ? 'On' : 'Off'}</button>
            </div>
            <div className="row" style={{ display: currentId === 'earth' ? '' : 'none' }}><span>Earth layers</span>
              <span>
                <button className="chip" aria-pressed={layers.clouds} onClick={() => onToggleLayer('clouds')}>Clouds</button>{' '}
                <button className="chip" aria-pressed={layers.atmo} onClick={() => onToggleLayer('atmo')}>Atmosphere</button>{' '}
                <button className="chip" aria-pressed={layers.night} onClick={() => onToggleLayer('night')}>Night lights</button>
              </span>
            </div>
            <h3>QUALITY</h3>
            <div className="row"><span>Texture quality</span>
              <select aria-label="Texture quality" value={quality}
                onChange={(e) => onQuality(e.target.value as Quality)}>
                <option value="standard">Standard</option>
                <option value="high">High (4K)</option>
                <option value="ultra">Ultra (8K)</option>
              </select>
            </div>
            <p className="kv">Ultra increases loading time and GPU memory use, and actual detail is limited by the source imagery. Only the Moon, Earth, Mars, Sun, Jupiter and Saturn offer High/Ultra tiers; the Ultra tier for the Sun, Jupiter and Saturn uses a 4K source.</p>
          </>
        ) : cfg ? (
          <>
            <h3>{cfg.name.toUpperCase()} · {cfg.latin} <span className="kv">{cfg.kind}</span></h3>
            <p>{cfg.intro}</p>

            {host && (
              <p className="kv hostline">
                Orbits <button className="inline-link" onClick={() => onSelectBody(host.id)}>{host.name}</button>
                {' · '}{cfg.au}
              </p>
            )}

            <h3>DATA</h3>
            <dl className="stats">
              {cfg.stats.map((st) => (
                <div className="stat" key={st.k}>
                  <dt>{st.k}</dt>
                  <dd>{st.v}</dd>
                </div>
              ))}
            </dl>

            <h3>KEY FACTS</h3>
            <ul>{cfg.facts.map((f) => <li key={f}>{f}</li>)}</ul>

            <h3>EXPLORATION</h3>
            <ul>{cfg.exploration.map((e) => <li key={e}>{e}</li>)}</ul>

            {moons.length > 0 && (
              <>
                <h3>MOONS ({moons.length})</h3>
                <div className="hl">
                  {moons.map((m) => (
                    <button key={m.id} className="hlbtn" onClick={() => onSelectBody(m.id)}>
                      <b>{m.name}</b><span>{m.dia} · {m.brief}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <h3>WHAT TO LOOK FOR</h3>
            <div className="hl">
              {cfg.highlights.map((h) => (
                <button
                  key={h.id}
                  className="hlbtn"
                  data-hl={h.id}
                  aria-pressed={currentHl === h.id ? 'true' : 'false'}
                  onClick={() => onHighlight(cfg, h)}
                >
                  <b>{h.title}</b><span>{h.desc}</span>
                </button>
              ))}
            </div>

            <h3>SOURCES</h3>
            <p className="kv">{cfg.sources.join('; ')}</p>
            <details>
              <summary>Further reading</summary>
              {cfg.more.map((m) => <p key={m.u}><a href={m.u} target="_blank" rel="noopener">{m.t} ↗</a></p>)}
            </details>
          </>
        ) : (
          <p className="kv">Select a body first.</p>
        )}
      </div>
    </aside>
  );
}
