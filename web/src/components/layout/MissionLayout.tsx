import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const MissionLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Mission Control</p>
            <h1 className="font-display text-4xl tracking-wide text-white">Quest Todo Command Center</h1>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>⌘K Quick Capture</p>
            <p>N New Quest</p>
            <p>F Focus Mode</p>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-10 border-t border-white/5 pt-6 text-xs text-slate-500">
          <p>Keep pushing the frontier. Your missions await.</p>
        </footer>
      </div>
    </div>
  );
};

export default MissionLayout;
