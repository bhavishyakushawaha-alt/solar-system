interface TopBarProps {
  overviewActive: boolean;
  selectorOpen: boolean;
  settingsActive: boolean;
  onOverview: () => void;
  onToggleSelector: () => void;
  onSettings: () => void;
}

/** Character-roll nav button (two-layer roll effect) */
function NavRoll({ label, active, expanded, onClick }: {
  label: string;
  active: boolean;
  expanded?: boolean;
  onClick: () => void;
}) {
  const chars = [...label];
  return (
    <button
      className={`navroll${active ? ' on' : ''}`}
      aria-expanded={expanded}
      onClick={onClick}
    >
      <span style={{ display: 'inline-block', overflow: 'hidden', height: '1.75em' }}>
        <span className="r a">
          {chars.map((ch, i) => (
            <span key={i} style={{ transitionDelay: `${i * 30}ms` }}>{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </span>
        <span className="r b" aria-hidden="true">
          {chars.map((ch, i) => (
            <span key={i} style={{ transitionDelay: `${i * 30}ms` }}>{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

export default function TopBar({
  overviewActive, selectorOpen, settingsActive,
  onOverview, onToggleSelector, onSettings,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-en">SOLAR SYSTEM</span>
        <span className="brand-cn">EXPLORER</span>
      </div>
      <nav aria-label="Main navigation">
        <NavRoll label="Overview" active={overviewActive} onClick={onOverview} />
        <NavRoll label="Bodies" active={selectorOpen} expanded={selectorOpen} onClick={onToggleSelector} />
        <NavRoll label="Settings" active={settingsActive} expanded={settingsActive} onClick={onSettings} />
      </nav>
    </header>
  );
}
