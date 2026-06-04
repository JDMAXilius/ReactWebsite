import { useApp } from "../../context/AppContext";
import { Avatar } from "../ui/Avatar";

type Page = "dashboard" | "projects" | "analytics" | "team" | "settings";

const NAV: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard",  label: "Dashboard",  icon: "⬡" },
  { id: "projects",   label: "Projects",   icon: "◈" },
  { id: "analytics",  label: "Analytics",  icon: "◎" },
  { id: "team",       label: "Team",       icon: "◉" },
  { id: "settings",   label: "Settings",   icon: "◌" },
];

export function Sidebar() {
  const { state, navigate } = useApp();
  const { page, sidebarOpen } = state;

  return (
    <aside style={{
      width: sidebarOpen ? "var(--sidebar-width)" : 0,
      flexShrink: 0,
      background: "var(--bg-surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
      overflow: "hidden",
      transition: "width 0.25s ease",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, minWidth: "var(--sidebar-width)" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⬡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Nexus</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Workspace</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", minWidth: "var(--sidebar-width)" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 12px 8px" }}>
          Main
        </div>
        {NAV.map(item => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: "var(--radius-md)",
                background: active ? "var(--primary-dim)" : "transparent",
                color: active ? "var(--primary)" : "var(--text-secondary)",
                border: "none", fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: "pointer", textAlign: "left", marginBottom: 2,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)", minWidth: "var(--sidebar-width)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-md)", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Avatar initials="JD" size={30} status="online" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>James Doe</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Admin</div>
          </div>
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>⋮</span>
        </div>
      </div>
    </aside>
  );
}
