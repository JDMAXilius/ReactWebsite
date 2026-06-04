import { memo } from "react";

type Props = { value: number; color?: string; height?: number };

export const ProgressBar = memo(function ProgressBar({ value, color = "var(--primary)", height = 5 }: Props) {
  return (
    <div style={{ background: "var(--bg-elevated)", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${Math.min(100, Math.max(0, value))}%`,
        background: value >= 100 ? "var(--success)" : color,
        borderRadius: 99, transition: "width 0.4s ease",
      }} />
    </div>
  );
});
