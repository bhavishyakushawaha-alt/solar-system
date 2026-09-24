import { useRef, useState } from 'react';

import { BODIES_BY_ID, GROUPS, ORDER, POEM } from '../solar/data';

interface BodySelectorProps {
  open: boolean;
  currentId: string | null;
  onSelect: (id: string) => void;
}

interface HoverInfo { id: string; x: number; y: number }

/** Left body list (grouped + hover preview card) */
export default function BodySelector({ open, currentId, onSelect }: BodySelectorProps) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleOver = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = (e.target as HTMLElement).closest('button') as HTMLButtonElement | null;
    if (!b || !listRef.current?.contains(b)) { setHover(null); return; }
    const id = b.dataset.id;
    if (!id) { setHover(null); return; }
    const cfg = BODIES_BY_ID[id];
    if (!cfg) { setHover(null); return; }
    const r = b.getBoundingClientRect();
    setHover({
      id,
      x: Math.min(innerWidth - 240, r.right + 14),
      y: Math.max(60, r.top - 6),
    });
  };

  const hoverCfg = hover ? BODIES_BY_ID[hover.id] : null;

  return (
    <>
      <aside id="selector" className={open ? '' : 'hidden'} aria-label="Select a body">
        <div
          id="planet-list"
          role="listbox"
          ref={listRef}
          onPointerOver={handleOver}
          onPointerLeave={() => setHover(null)}
        >
          {GROUPS.map(([gname, ids]) => (
            <div key={gname}>
              <div className="group">{gname}</div>
              {ids.map((id) => {
                const cfg = BODIES_BY_ID[id];
                const i = ORDER.indexOf(id);
                const on = currentId === id;
                return (
                  <button
                    key={id}
                    role="option"
                    aria-selected={on ? 'true' : 'false'}
                    data-id={id}
                    className={on ? 'on' : ''}
                    onClick={() => onSelect(id)}
                  >
                    <span className="no">{String(i + 1).padStart(2, '0')}</span>
                    <span>{cfg.name}</span>
                    <span className="en">{cfg.latin}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {hoverCfg && hover && (
        <div
          id="hover-preview"
          className="show"
          style={{ left: `${hover.x}px`, top: `${hover.y}px` }}
        >
          <b>{hoverCfg.name} <span>{hoverCfg.latin}</span></b>
          <p>Diameter {hoverCfg.dia}</p>
          <p>
            {hoverCfg.of
              ? `Moon of ${BODIES_BY_ID[hoverCfg.of].name}`
              : hoverCfg.au !== '—' ? `Distance from Sun ${hoverCfg.au}` : hoverCfg.kind}
          </p>
          <p className="poem">{POEM[hoverCfg.id] || hoverCfg.brief}</p>
        </div>
      )}
    </>
  );
}
