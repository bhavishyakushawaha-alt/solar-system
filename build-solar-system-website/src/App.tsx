import { useCallback, useEffect, useRef, useState } from 'react';

import BodySelector from './components/BodySelector';
import Caption from './components/Caption';
import Intro from './components/Intro';
import KbdHelp from './components/KbdHelp';
import ObsLog from './components/ObsLog';
import QuickCard from './components/QuickCard';
import SidePanel, { type PanelMode } from './components/SidePanel';
import Toolbar from './components/Toolbar';
import TopBar from './components/TopBar';
import { BODIES_BY_ID, ORDER, type BodyConfig, type Highlight } from './solar/data';
import { SolarSystem, type LayerState } from './solar/scene';
import type { Quality } from './solar/textures';

const time = () => {
  const t = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`;
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const solarRef = useRef<SolarSystem | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const reduceMotion = useRef(
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  /* ---- UI state (kept in sync with the scene) ---- */
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(true);
  const [panelMode, setPanelMode] = useState<PanelMode | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [spin, setSpin] = useState(true);
  const [orbit, setOrbit] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [labels, setLabels] = useState(true);
  const [quality, setQuality] = useState<Quality>('high');
  const [layers, setLayers] = useState<LayerState>({ clouds: true, atmo: true, night: true });
  const [currentHl, setCurrentHl] = useState<string | null>(null);
  const [kbdOpen, setKbdOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [obsLines, setObsLines] = useState<string[]>(() => [`${time()} System online`]);

  const obs = useCallback((msg: string) => {
    setObsLines((prev) => [`${time()} ${msg}`, ...prev].slice(0, 3));
  }, []);

  /* ---- Scene create / dispose ---- */
  useEffect(() => {
    const container = containerRef.current;
    const fx = fxRef.current;
    if (!container || !fx) return;

    const solar = new SolarSystem(container, fx, {
      onSelect: (id, preset) => {
        setCurrentId(id);
        setQuickOpen(!!id);   // pop the info card open every time a body is picked
        setCurrentHl(solar.getCurrentHl());
        setLayers(solar.getLayerState());
        if (id) {
          const cfg = BODIES_BY_ID[id];
          obs(`Focus ${cfg.name}${preset && preset !== 'default' ? ` · ${preset}` : ''}`);
        } else {
          obs('Back to overview');
        }
      },
      onStatus: setStatus,
      onError: (msg) => setError(msg),
    });
    solarRef.current = solar;
    solar.initLabels();

    return () => {
      solar.dispose();
      solarRef.current = null;
    };
  }, [obs]);

  /* ---- Panel open / close ---- */
  const openPanel = useCallback((mode: PanelMode) => {
    clearTimeout(closeTimer.current);
    setPanelMode(mode);
    requestAnimationFrame(() => requestAnimationFrame(() => setPanelOpen(true)));
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    closeTimer.current = window.setTimeout(() => setPanelMode(null), 260);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* ---- Interaction handlers ---- */
  const handleSelect = useCallback((id: string) => { solarRef.current?.select(id); }, []);
  const handleOverview = useCallback(() => {
    closePanel();
    solarRef.current?.overview();
  }, [closePanel]);

  const toggleDetails = useCallback(() => {
    if (panelMode === 'details') closePanel(); else openPanel('details');
  }, [panelMode, closePanel, openPanel]);

  const toggleSettings = useCallback(() => {
    if (panelMode === 'settings') closePanel(); else openPanel('settings');
  }, [panelMode, closePanel, openPanel]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => { const n = !p; solarRef.current?.setPlaying(n); return n; });
  }, []);
  const toggleSpin = useCallback(() => {
    setSpin((p) => { const n = !p; solarRef.current?.setSpin(n); return n; });
  }, []);
  const toggleOrbit = useCallback(() => {
    setOrbit((p) => { const n = !p; solarRef.current?.setOrbit(n); return n; });
  }, []);
  const handleSpeed = useCallback((v: number) => {
    setSpeed(v);
    solarRef.current?.setSpeed(v);
  }, []);
  const toggleOrbitLines = useCallback(() => {
    setShowOrbits((p) => { const n = !p; solarRef.current?.setOrbitLines(n); return n; });
  }, []);
  const resetView = useCallback(() => { solarRef.current?.resetView(); }, []);
  const step = useCallback((dir: number) => { solarRef.current?.step(dir); }, []);
  const toggleLabels = useCallback(() => {
    setLabels((p) => { const n = !p; solarRef.current?.setLabels(n); return n; });
  }, []);
  const handleQuality = useCallback((q: Quality) => {
    setQuality(q);
    solarRef.current?.setQuality(q);
  }, []);
  const handlePreset = useCallback((dir: string) => {
    const id = solarRef.current?.getCurrentId() ?? 'moon';
    solarRef.current?.select(id, dir);
  }, []);
  const toggleLayer = useCallback((layer: 'clouds' | 'atmo' | 'night') => {
    const solar = solarRef.current;
    if (!solar) return;
    const next = solar.getLayerState();
    const on = !next[layer];
    if (layer === 'clouds') solar.setClouds(on);
    if (layer === 'atmo') solar.setAtmo(on);
    if (layer === 'night') solar.setNight(on);
    setLayers({ ...next, [layer]: on });
  }, []);
  const handleHighlight = useCallback((cfg: BodyConfig, h: Highlight) => {
    const solar = solarRef.current;
    if (!solar) return;
    solar.runHighlight(cfg, h);
    setCurrentHl(solar.getCurrentHl());
    setLayers(solar.getLayerState());
  }, []);

  /* ---- Full keyboard control ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.matches('input, select, textarea')) return;
      const solar = solarRef.current;
      if (!solar) return;
      switch (e.key) {
        case 'ArrowLeft': solar.step(-1); break;
        case 'ArrowRight': solar.step(1); break;
        case 'ArrowUp': solar.dolly(0.85); e.preventDefault(); break;
        case 'ArrowDown': solar.dolly(1.18); e.preventDefault(); break;
        case ' ': togglePlay(); e.preventDefault(); break;
        case 'o': case 'O': handleOverview(); break;
        case 'd': case 'D': toggleDetails(); break;
        case 's': case 'S': toggleSettings(); break;
        case 'h': case 'H': setKbdOpen((v) => !v); break;
        case 'i': case 'I': if (solar.getCurrentId()) setQuickOpen((v) => !v); break;
        case 'Escape': setKbdOpen(false); closePanel(); setQuickOpen(false); break;
        default: {
          const n = parseInt(e.key, 10);
          if (!isNaN(n) && n >= 0 && n <= 9) {
            const i = n === 0 ? 9 : n - 1;
            if (i < ORDER.length) solar.select(ORDER[i]);
          }
        }
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [togglePlay, handleOverview, toggleDetails, toggleSettings, closePanel]);

  /* ---- Intro ---- */
  const getProgress = useCallback(() => solarRef.current?.getProgress() ?? 1, []);
  const handleEnter = useCallback(() => {
    setEntered(true);
    solarRef.current?.overview();
  }, []);

  const stepLabel = currentId ? BODIES_BY_ID[currentId].name.toUpperCase() : 'SOLAR';

  return (
    <>
      <main id="experience" aria-label="Interactive solar system">
        <div id="viewport" ref={containerRef} />
      </main>

      <div id="ui">
        {/* FX layer: overview labels / crosshair / surface lat-lon readout (mounted by the scene) */}
        <div ref={fxRef} />

        <TopBar
          overviewActive={!currentId}
          selectorOpen={selectorOpen}
          settingsActive={panelMode === 'settings'}
          onOverview={handleOverview}
          onToggleSelector={() => setSelectorOpen((v) => !v)}
          onSettings={toggleSettings}
        />

        <BodySelector open={selectorOpen} currentId={currentId} onSelect={handleSelect} />

        <Caption
          withCard={quickOpen && !!currentId && !panelOpen}
          currentId={currentId}
          reduceMotion={reduceMotion.current}
          onDetails={toggleDetails}
        />

        {status && <div id="load-status">{status}</div>}
        {error && (
          <div id="load-error">
            <span>{error}</span>
            <button onClick={() => setError(null)}>Retry</button>
            <button onClick={() => { handleQuality('standard'); setError(null); }}>Use standard quality</button>
          </div>
        )}

        <Toolbar
          playing={playing}
          spin={spin}
          orbit={orbit}
          speed={speed}
          showOrbits={showOrbits}
          stepLabel={stepLabel}
          onTogglePlay={togglePlay}
          onToggleSpin={toggleSpin}
          onToggleOrbit={toggleOrbit}
          onSpeed={handleSpeed}
          onToggleOrbitLines={toggleOrbitLines}
          onResetView={resetView}
          onStep={step}
        />

        <SidePanel
          mode={panelMode ?? 'settings'}
          open={panelOpen}
          currentId={currentId}
          currentHl={currentHl}
          playing={playing}
          spin={spin}
          orbit={orbit}
          speed={speed}
          labels={labels}
          quality={quality}
          layers={layers}
          onClose={closePanel}
          onTogglePlay={togglePlay}
          onToggleSpin={toggleSpin}
          onToggleOrbit={toggleOrbit}
          onSpeed={handleSpeed}
          onPreset={handlePreset}
          onToggleLabels={toggleLabels}
          onToggleLayer={toggleLayer}
          onQuality={handleQuality}
          onHighlight={handleHighlight}
          onSelectBody={handleSelect}
        />

        {quickOpen && currentId && !panelOpen && (
          <QuickCard
            key={currentId}
            id={currentId}
            onClose={() => setQuickOpen(false)}
            onFull={() => openPanel('details')}
            onSelectBody={handleSelect}
          />
        )}

        <ObsLog lines={obsLines} />
        <KbdHelp open={kbdOpen} />
      </div>

      {!entered && (
        <Intro
          reduceMotion={reduceMotion.current}
          getProgress={getProgress}
          onEnter={handleEnter}
        />
      )}
    </>
  );
}
