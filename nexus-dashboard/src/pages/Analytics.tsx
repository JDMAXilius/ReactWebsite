// Ch07: useDeferredValue for smooth search — input stays responsive even with large tables
import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { useSearch } from "../hooks/useSearch";
import { ANALYTICS, CHART_DATA } from "../data/mock";

function MiniSparkline({ up }: { up: boolean }) {
  return (
    <svg width="48" height="20" viewBox="0 0 48 20">
      <polyline
        points={up ? "0,18 12,14 24,10 36,6 48,2" : "0,2 12,6 24,10 36,14 48,18"}
        fill="none"
        stroke={up ? "var(--success)" : "var(--danger)"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function KpiRow() {
  const kpis = [
    { label: "Total Pageviews", value: "64,280", change: "+18.2%", up: true },
    { label: "Unique Visitors", value: "32,470", change: "+11.4%", up: true },
    { label: "Avg Bounce Rate", value: "31%",    change: "-4.1%",  up: true },
    { label: "Avg Session",     value: "3m 14s", change: "+0.8%",  up: true },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "var(--border)" }}>
      {kpis.map(k => (
        <div key={k.label} style={{ background: "var(--bg-surface)", padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{k.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{k.value}</div>
          <div style={{ fontSize: 12, color: k.up ? "var(--success)" : "var(--danger)" }}>{k.change} this month</div>
        </div>
      ))}
    </div>
  );
}

function UserGrowthChart() {
  const max = Math.max(...CHART_DATA.map(d => d.users));
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 100 }}>
        {CHART_DATA.map((d) => (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{d.users.toLocaleString()}</div>
            <div style={{ width: "100%", display: "flex", gap: 3, alignItems: "flex-end", height: 60 }}>
              <div style={{ flex: 1, background: "var(--primary)", opacity: 0.3, borderRadius: "3px 3px 0 0", height: `${(d.revenue / Math.max(...CHART_DATA.map(x => x.revenue))) * 60}px` }} />
              <div style={{ flex: 1, background: "var(--info)", borderRadius: "3px 3px 0 0", height: `${(d.users / max) * 60}px` }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.month}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: "var(--text-muted)" }}>
          <div style={{ width: 10, height: 10, background: "var(--primary)", opacity: 0.3, borderRadius: 2 }} />Revenue
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: "var(--text-muted)" }}>
          <div style={{ width: 10, height: 10, background: "var(--info)", borderRadius: 2 }} />Users
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { query, setQuery, results, isStale } = useSearch(ANALYTICS, ["page"]);
  const [sortBy, setSortBy] = useState<"views" | "visitors" | "bounceRate">("views");

  const sorted = [...results].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI strip */}
      <Card padded={false} style={{ overflow: "hidden" }}>
        <KpiRow />
      </Card>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <Card.Header>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Growth Trends</span>
            <Badge variant="info">6 months</Badge>
          </Card.Header>
          <Card.Body><UserGrowthChart /></Card.Body>
        </Card>

        <Card>
          <Card.Header><span style={{ fontSize: 14, fontWeight: 600 }}>Top Sources</span></Card.Header>
          <Card.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Organic Search", 42, "var(--success)"], ["Direct", 28, "var(--primary)"], ["Referral", 18, "var(--info)"], ["Social", 12, "var(--warning)"]].map(([src, pct, color]) => (
                <div key={src as string}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span>{src}</span><span style={{ color: color as string, fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ background: "var(--bg-elevated)", borderRadius: 99, height: 5 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: color as string, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Pages table — useDeferredValue powers the search */}
      <Card>
        <Card.Header>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            Page Analytics
            {isStale && <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>updating…</span>}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <Input placeholder="Search pages…" value={query} onChange={e => setQuery(e.target.value)}
              icon={<span style={{ fontSize: 13 }}>⌕</span>} style={{ width: 200 }} />
            <select
              value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)", color: "var(--text-primary)", borderRadius: "var(--radius-md)", padding: "6px 10px", fontSize: 12 }}
            >
              <option value="views">Sort: Views</option>
              <option value="visitors">Sort: Visitors</option>
              <option value="bounceRate">Sort: Bounce</option>
            </select>
          </div>
        </Card.Header>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Page", "Views", "Visitors", "Bounce Rate", "Avg Time", "Trend"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ opacity: isStale ? 0.6 : 1, transition: "opacity 0.2s" }}>
              {sorted.map((row, i) => (
                <tr key={row.id} style={{ borderBottom: i < sorted.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 20px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--primary)" }}>{row.page}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13 }}>{row.views.toLocaleString()}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13 }}>{row.visitors.toLocaleString()}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <Badge variant={row.bounceRate < 30 ? "success" : row.bounceRate < 50 ? "warning" : "danger"}>{row.bounceRate}%</Badge>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "var(--text-secondary)" }}>{row.avgTime}</td>
                  <td style={{ padding: "12px 20px" }}><MiniSparkline up={row.trend === "up"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No pages found</div>}
        </div>
      </Card>
    </div>
  );
}
