interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar = ({ value, max }: ProgressBarProps) => {
  const ratio = max === 0 ? 0 : Math.min(1, value / max);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-amber-300 transition-all duration-300"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
};

export default ProgressBar;
