import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Button } from "../ui/Button";
import { NotificationsPanel } from "../ui/NotificationsPanel";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard", projects: "Projects",
  analytics: "Analytics", team: "Team", settings: "Settings",
};

const UNREAD_COUNT = 2;

export function Header() {
  const { state, dispatch, toggleTheme } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  function openPalette() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  }

  return (
    <>
      <header style={{
        height: "var(--header-height)", padding: "0 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-surface)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 18, padding: 4, display: "flex" }}
            title="Toggle sidebar"
          >
            ☰
          </button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{PAGE_TITLES[state.page]}</h1>
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Nexus Workspace</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search / Command Palette trigger */}
          <button
            onClick={openPalette}
            title="Search (⌘K)"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 10px", borderRadius: "var(--radius-sm)",
              background: "none", border: "1px solid var(--border-strong)",
              color: "var(--text-muted)", cursor: "pointer", fontSize: 12,
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 14 }}>⌕</span>
            <span>Search</span>
            <kbd style={{ fontSize: 10, background: "var(--bg-elevated)", border: "1px solid var(--border-strong)", borderRadius: 3, padding: "1px 4px" }}>⌘K</kbd>
          </button>

          <Button
            variant="ghost" size="sm"
            onClick={toggleTheme}
            title="Toggle theme"
            icon={<span>{state.theme === "dark" ? "☀️" : "🌙"}</span>}
          >
            {state.theme === "dark" ? "Light" : "Dark"}
          </Button>

          {/* Notification bell */}
          <button
            onClick={() => setNotifOpen(o => !o)}
            title="Notifications"
            style={{
              position: "relative", background: notifOpen ? "var(--bg-elevated)" : "none",
              border: "none", color: "var(--text-secondary)", cursor: "pointer",
              fontSize: 18, padding: 6, display: "flex", borderRadius: "var(--radius-sm)",
              transition: "background 0.15s",
            }}
          >
            🔔
            <span style={{
              position: "absolute", top: 2, right: 2,
              width: 16, height: 16, borderRadius: "50%",
              background: "var(--danger)", border: "2px solid var(--bg-surface)",
              fontSize: 9, color: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700,
            }}>{UNREAD_COUNT}</span>
          </button>
        </div>
      </header>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
