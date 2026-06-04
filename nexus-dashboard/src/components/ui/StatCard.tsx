import { memo } from "react";
import { Card } from "./Card";

type Props = {
  label: string; value: string; change: string;
  trend: "up" | "down" | "flat"; icon: React.ReactNode;
};

// React.memo — Ch05: only re-renders when props change
export const StatCard = memo(function StatCard({ label, value, change, trend, icon }: Props) {
  const trendColor = trend === "up" ? "var(--success)" : trend === "down" ? "var(--danger)" : "var(--text-muted)";
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <Card hoverable>
      <Card.Body style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {label}
          </span>
          <span style={{ color: "var(--primary)", background: "var(--primary-dim)", padding: "6px", borderRadius: "var(--radius-sm)", display: "flex" }}>
            {icon}
          </span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>{value}</div>
        <div style={{ fontSize: 12, color: trendColor, display: "flex", alignItems: "center", gap: 4 }}>
          <span>{trendIcon}</span>
          <span>{change} vs last month</span>
        </div>
      </Card.Body>
    </Card>
  );
});
