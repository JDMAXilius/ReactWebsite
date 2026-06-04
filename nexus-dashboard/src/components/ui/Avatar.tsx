import { memo } from "react";

const COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#38bdf8","#ef4444","#14b8a6"
];

function hashColor(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return COLORS[h % COLORS.length];
}

type Props = { initials: string; size?: number; status?: "online" | "away" | "offline" };

// React.memo — Ch05
export const Avatar = memo(function Avatar({ initials, size = 32, status }: Props) {
  const bg = hashColor(initials);
  const statusColor = status === "online" ? "var(--success)" : status === "away" ? "var(--warning)" : "var(--text-muted)";

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: bg + "33", border: `1.5px solid ${bg}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 700, color: bg, flexShrink: 0,
      }}>
        {initials}
      </div>
      {status && (
        <span style={{
          position: "absolute", bottom: 0, right: 0,
          width: size * 0.3, height: size * 0.3,
          borderRadius: "50%", background: statusColor,
          border: "1.5px solid var(--bg-surface)",
        }} />
      )}
    </div>
  );
});
