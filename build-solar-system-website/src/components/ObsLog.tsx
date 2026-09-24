interface ObsLogProps {
  lines: string[];
}

/** Bottom-right observation log (max 3 lines, newest first) */
export default function ObsLog({ lines }: ObsLogProps) {
  return (
    <div id="obslog">
      {lines.map((l, i) => <div key={`${l}-${i}`}>{l}</div>)}
    </div>
  );
}
