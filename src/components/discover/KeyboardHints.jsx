const hints = [
  { key: '←', label: 'Pass' },
  { key: '→', label: 'Like' },
  { key: '↑', label: 'Watched' },
  { key: 'B', label: 'Save' },
];

const KeyboardHints = () => (
  <div className="hidden md:flex items-center gap-5 text-text-tertiary text-[11px] uppercase tracking-wider">
    {hints.map((h) => (
      <span key={h.key} className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded border border-border-strong bg-white/5 font-mono text-text-secondary">
          {h.key}
        </kbd>
        {h.label}
      </span>
    ))}
  </div>
);

export default KeyboardHints;