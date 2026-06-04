// Ch05: HOC pattern (withRoleBadge), Render Props, Compound Components
import { memo } from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useSearch } from "../hooks/useSearch";
import { TEAM, type TeamMember } from "../data/mock";

// ── HOC Pattern — Ch05 ─────────────────────────────────────────────────────
function withRoleBadge<P extends { member: TeamMember }>(
  WrappedComponent: React.ComponentType<P>
) {
  return function EnhancedMember(props: P) {
    const roleVariant: Record<string, "primary" | "info" | "warning"> = {
      "Lead Engineer":      "primary",
      "Frontend Engineer":  "info",
      "Backend Engineer":   "warning",
      "Full Stack Engineer":"info",
      "DevOps Engineer":    "warning",
      "Data Engineer":      "primary",
    };
    return (
      <div>
        <WrappedComponent {...props} />
        <div style={{ marginTop: 8 }}>
          <Badge variant={roleVariant[props.member.role] ?? "default"}>
            {props.member.role}
          </Badge>
        </div>
      </div>
    );
  };
}

// ── Base Member Card (React.memo — Ch05) ───────────────────────────────────
const MemberBase = memo(function MemberBase({ member }: { member: TeamMember }) {
  const statusLabel = { online: "Online", away: "Away", offline: "Offline" };
  const statusVariant: Record<string, "success" | "warning" | "default"> = {
    online: "success", away: "warning", offline: "default",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
      <Avatar initials={member.avatar} size={56} status={member.status} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{member.name}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{member.email}</div>
      </div>
      <Badge variant={statusVariant[member.status]} dot>
        {statusLabel[member.status]}
      </Badge>
    </div>
  );
});

const EnhancedMember = withRoleBadge(MemberBase);

// ── Render Props — sharing stats render logic ──────────────────────────────
function TeamStats({ render }: {
  render: (stats: { total: number; online: number; projects: number }) => React.ReactNode
}) {
  const stats = {
    total: TEAM.length,
    online: TEAM.filter(m => m.status === "online").length,
    projects: TEAM.reduce((sum, m) => sum + m.projects, 0),
  };
  return <>{render(stats)}</>;
}

export default function Team() {
  const { query, setQuery, results } = useSearch(TEAM, ["name", "role", "email"]);

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats via Render Props pattern */}
      <TeamStats render={stats => (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { label: "Team Members", value: stats.total, color: "var(--primary)" },
            { label: "Online Now",   value: stats.online, color: "var(--success)" },
            { label: "Active Tasks", value: stats.projects, color: "var(--info)" },
          ].map(s => (
            <Card key={s.label}>
              <Card.Body style={{ padding: "20px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )} />

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Input placeholder="Search team…" value={query} onChange={e => setQuery(e.target.value)}
          icon={<span style={{ fontSize: 13 }}>⌕</span>} style={{ width: 260 }} />
        <Button variant="primary" icon={<span>+</span>}>Invite Member</Button>
      </div>

      {/* Team grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {results.map(member => (
          <Card key={member.id} hoverable>
            <Card.Body style={{ padding: "24px 20px" }}>
              <EnhancedMember member={member} />
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                <span>{member.projects} projects</span>
                <a href={`mailto:${member.email}`} style={{ color: "var(--primary)", fontSize: 12 }}>Contact</a>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>No members found</div>
      )}
    </div>
  );
}
