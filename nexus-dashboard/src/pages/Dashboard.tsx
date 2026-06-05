// Ch07: useTransition for navigation, Ch05: React.memo for stat cards
// Ch09: use() hook — suspends on a Promise, replaces useEffect+loading state
import { use, Suspense, useTransition } from "react";
import { StatCard } from "../components/ui/StatCard";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useApp } from "../context/AppContext";
import { ACTIVITY, CHART_DATA } from "../data/mock";

// Promise is cached outside the component — re-creating it on render would cause infinite suspense
const systemHealthPromise = new Promise<{ uptime: string; requests: string; p99: string; errors: string }>(
  resolve => setTimeout(() => resolve({ uptime: "99.97%", requests: "1.24M", p99: "42ms", errors: "0.03%" }), 1400)
);

function SystemHealth() {
  // use() unwraps the promise — this component suspends until it resolves
  const health = use(systemHealthPromise);
  const items = [
    { label: "Uptime",    value: health.uptime,   color: "var(--success)" },
    { label: "Requests",  value: health.requests, color: "var(--info)" },
    { label: "P99 Lat.",  value: health.p99,      color: "var(--warning)" },
    { label: "Errors",    value: health.errors,   color: "var(--danger)" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--border)" }}>
      {items.map(item => (
        <div key={item.label} style={{ background: "var(--bg-surface)", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

const STATS = [
  { label: "Total Revenue", value: "$72,400", change: "+12.5%", trend: "up" as const, icon: <span>💰</span> },
  { label: "Active Projects", value: "24", change: "+3", trend: "up" as const, icon: <span>◈</span> },
  { label: "Team Members", value: "6", change: "0", trend: "flat" as const, icon: <span>◉</span> },
  { label: "Avg Completion", value: "68%", change: "-2%", trend: "down" as const, icon: <span>◎</span> },
];

function RevenueChart() {
  const max = Math.max(...CHART_DATA.map(d => d.revenue));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120, padding: "0 4px" }}>
      {CHART_DATA.map(d => (
        <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            ${(d.revenue / 1000).toFixed(0)}k
          </div>
          <div style={{
            width: "100%", background: "var(--primary)", borderRadius: "4px 4px 0 0",
            height: `${(d.revenue / max) * 80}px`, opacity: 0.8,
            transition: "height 0.5s ease",
          }} />
          <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.month}</div>
        </div>
      ))}
    </div>
  );
}

function ProjectStatus() {
  const { state, navigate } = useApp();
  const [isPending, startTransition] = useTransition(); // Ch07 — concurrent navigation

  const recent = state.projects.slice(0, 5);
  const statusMap: Record<string, "success" | "warning" | "default"> = {
    active: "success", paused: "warning", completed: "default",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {recent.map((p, i) => (
        <div key={p.id} style={{
          padding: "14px 0",
          borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.name}
            </div>
            <ProgressBar value={p.progress} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <Badge variant={statusMap[p.status]}>{p.progress}%</Badge>
          </div>
        </div>
      ))}
      <button
        onClick={() => startTransition(() => navigate("projects"))}
        style={{
          marginTop: 14, background: "none", border: "none",
          color: isPending ? "var(--text-muted)" : "var(--primary)",
          fontSize: 13, cursor: "pointer", textAlign: "left", padding: 0,
        }}
      >
        {isPending ? "Loading..." : "View all projects →"}
      </button>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {ACTIVITY.map((a, i) => (
        <div key={a.id} style={{
          display: "flex", gap: 12, alignItems: "flex-start",
          padding: "12px 0",
          borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--border)" : "none",
        }}>
          <Avatar initials={a.avatar} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, lineHeight: 1.5 }}>
              <strong>{a.user}</strong>
              <span style={{ color: "var(--text-secondary)" }}> {a.action} </span>
              <strong style={{ color: "var(--primary)" }}>{a.target}</strong>
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* System Health — use() + Suspense: header renders immediately, body waits for Promise */}
      <Card padded={false} style={{ overflow: "hidden" }}>
        <Card.Header>
          <span style={{ fontSize: 14, fontWeight: 600 }}>System Health</span>
          <Badge variant="success" dot>Live</Badge>
        </Card.Header>
        <Suspense fallback={
          <div style={{ padding: "18px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--text-muted)", fontSize: 12 }}>
            <div style={{ width: 12, height: 12, border: "2px solid var(--border-strong)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            Fetching metrics…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }>
          <SystemHealth />
        </Suspense>
      </Card>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <Card.Header>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Revenue Overview</span>
            <Badge variant="success" dot>Live</Badge>
          </Card.Header>
          <Card.Body><RevenueChart /></Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Project Status</span>
          </Card.Header>
          <Card.Body><ProjectStatus /></Card.Body>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <Card.Header>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Recent Activity</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Last 24 hours</span>
        </Card.Header>
        <Card.Body><ActivityFeed /></Card.Body>
      </Card>
    </div>
  );
}
