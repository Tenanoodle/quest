import Card from './Card';

const KeyboardShortcuts = () => {
  const items = [
    { combo: '⌘K / Ctrl+K', label: 'Quick Capture' },
    { combo: 'N', label: 'New Quest' },
    { combo: 'F', label: 'Toggle Focus' }
  ];

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 hidden w-64 text-xs text-slate-300 md:block">
      <Card>
        <h3 className="pb-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Shortcuts</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.combo} className="flex justify-between">
              <span>{item.combo}</span>
              <span className="text-slate-400">{item.label}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default KeyboardShortcuts;
