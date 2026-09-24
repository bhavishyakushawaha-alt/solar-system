interface KbdHelpProps {
  open: boolean;
}

/** Keyboard shortcut card (toggle with H) */
export default function KbdHelp({ open }: KbdHelpProps) {
  return (
    <div id="kbd-help" className={open ? 'show' : ''}>
      <h3>Keyboard shortcuts</h3>
      <p>
        ← / → previous · next body<br />
        ↑ / ↓ zoom in · zoom out<br />
        Space pause　1–0 jump to the first ten bodies<br />
        O overview　D details　S settings　H this card<br />I show / hide the info card<br />Click any planet or moon to focus it
      </p>
    </div>
  );
}
