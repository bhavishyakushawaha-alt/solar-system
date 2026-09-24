import { BODIES_BY_ID } from '../solar/data';
import { PROFILES, type Layer, type Temperature } from '../solar/profiles';

interface QuickCardProps {
  id: string;
  onClose: () => void;
  onFull: () => void;
  onSelectBody: (id: string) => void;
}

/* Thermometer scale: absolute zero to +500 °C */
const T_MIN = -273;
const T_MAX = 500;
const pct = (v: number) => Math.min(100, Math.max(0, ((v - T_MIN) / (T_MAX - T_MIN)) * 100));
const toF = (c: number) => Math.round(c * 9 / 5 + 32);
const fmt = (n: number) => (n < 0 ? `−${Math.abs(n).toLocaleString('en-US')}` : n.toLocaleString('en-US'));

function Thermometer({ t }: { t: Temperature }) {
  const offScale = t.min > T_MAX;
  const lo = pct(t.min);
  const hi = pct(t.max);
  const mid = pct(t.mean);
  const single = t.min === t.max;

  return (
    <div className="thermo">
      <div className="thermo-read">
        <span className="thermo-big">{fmt(t.mean)}<small> °C</small></span>
        <span className="thermo-f">{fmt(toF(t.mean))} °F</span>
      </div>
      <div className="thermo-where">
        {single ? t.where : `${t.where} · average`}
      </div>
      {!single && (
        <div className="thermo-range">
          Range {fmt(t.min)} °C to {fmt(t.max)} °C
        </div>
      )}

      <div className="thermo-bar" aria-hidden="true">
        {offScale ? (
          <div className="thermo-off">far beyond this scale ▶</div>
        ) : (
          <>
            <div className="thermo-span" style={{ left: `${lo}%`, width: `${Math.max(hi - lo, 0.8)}%` }} />
            <div className="thermo-dot" style={{ left: `${mid}%` }} />
          </>
        )}
        {/* reference ticks */}
        <i className="thermo-tick" style={{ left: `${pct(0)}%` }} />
        <i className="thermo-tick" style={{ left: `${pct(100)}%` }} />
      </div>
      <div className="thermo-scale" aria-hidden="true">
        <span style={{ left: '0%' }}>−273°</span>
        <span style={{ left: `${pct(0)}%` }}>0° ice melts</span>
        <span style={{ left: `${pct(100)}%` }}>100°</span>
        <span style={{ left: '100%' }}>500°</span>
      </div>

      {t.note && <p className="qc-note">{t.note}</p>}
      {t.core && <p className="qc-note qc-core">Deep inside: {t.core}</p>}
    </div>
  );
}

/*
 * Half-cut sphere: the left half shows the surface, the right half the layers.
 * Very thin outer layers (crusts, ice shells) are widened a little so you can see them.
 */
function Cutaway({ layers, surface }: { layers: Layer[]; surface: string }) {
  const S = 128, cx = S / 2, cy = S / 2, R = 58, MIN_BAND = 3.2;

  // Work from the outside in so every band keeps a minimum visible thickness
  const radii: number[] = new Array(layers.length);
  let prev = R;
  for (let i = layers.length - 1; i >= 0; i--) {
    const target = layers[i].r * R;
    radii[i] = i === layers.length - 1 ? R : Math.min(target, prev - MIN_BAND);
    prev = radii[i];
  }

  const clipId = `cut-${layers.length}-${Math.round(R)}`;
  return (
    <svg className="cutaway" viewBox={`0 0 ${S} ${S}`} width={S} height={S} role="img" aria-label="Interior cross-section">
      <defs>
        <clipPath id={clipId}><rect x={cx} y={0} width={S / 2} height={S} /></clipPath>
        <radialGradient id="cut-shade" cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      {/* surface half */}
      <circle cx={cx} cy={cy} r={R} fill={surface} />
      <circle cx={cx} cy={cy} r={R} fill="url(#cut-shade)" />
      {/* layered half — outermost first so inner layers paint over it */}
      <g clipPath={`url(#${clipId})`}>
        {layers.map((_, i) => layers.length - 1 - i).map((i) => (
          <circle key={layers[i].name} cx={cx} cy={cy} r={radii[i]} fill={layers[i].color} />
        ))}
        <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(243,239,231,0.25)" strokeWidth="1" />
    </svg>
  );
}

/** Pop-up summary shown whenever a planet or moon is selected */
export default function QuickCard({ id, onClose, onFull, onSelectBody }: QuickCardProps) {
  const cfg = BODIES_BY_ID[id];
  const p = PROFILES[id];
  if (!cfg || !p) return null;
  const host = cfg.of ? BODIES_BY_ID[cfg.of] : null;

  return (
    <aside className="quick-card" aria-label={`${cfg.name} at a glance`}>
      <header className="qc-head">
        <div>
          <div className="qc-kind">{cfg.kind.toUpperCase()} · {p.type}</div>
          <h2 className="qc-name">{cfg.name} <span>{cfg.latin}</span></h2>
          {host && (
            <div className="qc-host">
              Moon of <button className="inline-link" onClick={() => onSelectBody(host.id)}>{host.name}</button>
            </div>
          )}
        </div>
        <button className="qc-close" aria-label="Close info card" onClick={onClose}>×</button>
      </header>

      <p className="qc-glance">{p.glance}</p>

      <div className="qc-grid">
        <div><span>Diameter</span><b>{cfg.dia}</b></div>
        <div><span>Gravity</span><b>{p.gravity}</b></div>
        <div><span>Day</span><b>{p.day}</b></div>
        <div><span>{cfg.of ? 'Orbit' : cfg.id === 'sun' ? 'Galactic orbit' : 'Year'}</span><b>{p.year}</b></div>
      </div>

      <h3 className="qc-h">TEMPERATURE</h3>
      <Thermometer t={p.temp} />

      <h3 className="qc-h">HOW IT’S BUILT</h3>
      <p className="qc-build">{p.build}</p>
      <div className="qc-structure">
        <Cutaway layers={p.layers} surface={p.surface} />
        <ol className="qc-layers">
          {[...p.layers].reverse().map((l) => (
            <li key={l.name}>
              <i style={{ background: l.color }} />
              <div><b>{l.name}</b><span>{l.note}</span></div>
            </li>
          ))}
        </ol>
      </div>
      <p className="qc-foot">Outside → inside. Thin layers widened for visibility.</p>

      <button className="qc-full" onClick={onFull}>Full profile, facts &amp; missions ↗</button>
    </aside>
  );
}
