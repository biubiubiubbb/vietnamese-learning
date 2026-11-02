interface Props {
  value: number; // 0-100
  height?: number;
}

export default function ProgressBar({ value, height = 16 }: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="pbar" style={{ height }} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className="pbar-fill" style={{ width: `${v}%` }} />
    </div>
  );
}
