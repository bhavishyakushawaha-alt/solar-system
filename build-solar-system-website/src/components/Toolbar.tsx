interface ToolbarProps {
  playing: boolean;
  spin: boolean;
  orbit: boolean;
  speed: number;
  showOrbits: boolean;
  stepLabel: string;
  onTogglePlay: () => void;
  onToggleSpin: () => void;
  onToggleOrbit: () => void;
  onSpeed: (v: number) => void;
  onToggleOrbitLines: () => void;
  onResetView: () => void;
  onStep: (dir: number) => void;
}

/** Bottom time & display control bar */
export default function Toolbar({
  playing, spin, orbit, speed, showOrbits, stepLabel,
  onTogglePlay, onToggleSpin, onToggleOrbit, onSpeed, onToggleOrbitLines, onResetView, onStep,
}: ToolbarProps) {
  return (
    <footer className="toolbar" role="toolbar" aria-label="Time and display controls">
      <div className="tb-group">
        <button id="pp" className="tb" aria-pressed={playing} onClick={onTogglePlay}>
          <span className="ic" aria-hidden="true">{playing ? '⏸' : '▶'}</span>{playing ? 'Pause' : 'Play'}
        </button>
        <button id="spn" className="tb" aria-pressed={spin} onClick={onToggleSpin}>
          <span className="ic" aria-hidden="true">↻</span>Spin
        </button>
        <button id="orb" className="tb" aria-pressed={orbit} onClick={onToggleOrbit}>
          <span className="ic" aria-hidden="true">⊙</span>Orbit
        </button>
        <label className="tb spd">
          Speed
          <input
            id="spd" type="range" min="0" max="4" step="0.1" value={speed}
            aria-label="Time speed"
            onChange={(e) => onSpeed(parseFloat(e.target.value))}
          />
        </label>
        <button id="orbitT" className="tb" aria-pressed={showOrbits} onClick={onToggleOrbitLines}>
          <span className="ic" aria-hidden="true">⋯</span>Orbits
        </button>
        <button id="resetV" className="tb" onClick={onResetView}>
          <span className="ic" aria-hidden="true">↺</span>Reset view
        </button>
      </div>
      <div className="stepper">
        <button id="previous" aria-label="Previous body" onClick={() => onStep(-1)}>←</button>
        <span id="step-label">{stepLabel}</span>
        <button id="next" aria-label="Next body" onClick={() => onStep(1)}>→</button>
      </div>
    </footer>
  );
}
