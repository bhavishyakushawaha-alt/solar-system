import { useEffect, useState } from 'react';

import { BODIES_BY_ID, ORDER, POEM } from '../solar/data';
import { useDecodeText } from '../hooks/useDecodeText';

interface CaptionProps {
  currentId: string | null;
  withCard?: boolean;
  reduceMotion: boolean;
  onDetails: () => void;
}

const DEFAULT_NAME = 'Solar System';
const DEFAULT_DESC = 'Pick a body to start observing · sizes and distances are scaled for display';

/** Bottom-left summary of the current body (fade out → swap → fade in, with decode effect) */
export default function Caption({ currentId, withCard, reduceMotion, onDetails }: CaptionProps) {
  const [displayId, setDisplayId] = useState(currentId);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    if (reduceMotion || currentId === displayId) { setDisplayId(currentId); return; }
    setFading(true);
    const t = setTimeout(() => { setDisplayId(currentId); setFading(false); }, 190);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, reduceMotion]);

  const shown = displayId ? BODIES_BY_ID[displayId] : null;
  const name = shown ? shown.name : DEFAULT_NAME;
  const desc = shown ? (POEM[shown.id] || shown.brief) : DEFAULT_DESC;
  const nameRef = useDecodeText(name, 320);
  const descRef = useDecodeText(desc, 420);

  return (
    <section className={`caption${fading ? ' fading' : ''}${withCard ? ' with-card' : ''}`} aria-live="polite">
      <div className="caption-index">
        {shown ? `${String(ORDER.indexOf(shown.id) + 1).padStart(2, '0')} / ${ORDER.length}` : '— / 10'}
      </div>
      <div className="name-row">
        <h1 ref={nameRef as React.RefObject<HTMLHeadingElement>}>{name}</h1>
        <span>{shown ? shown.latin : 'OVERVIEW'}</span>
        {shown && <span className="tag">{shown.kind}</span>}
      </div>
      <p ref={descRef as React.RefObject<HTMLParagraphElement>}>{desc}</p>
      {shown && <p className="caption-dia">Diameter {shown.dia}</p>}
      {shown && (
        <button id="details" className="text-link" onClick={onDetails}>
          Full profile <span aria-hidden="true">↗</span>
        </button>
      )}
    </section>
  );
}
