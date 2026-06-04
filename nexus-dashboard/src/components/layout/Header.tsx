import { useApp } from "../../context/AppContext";
import { Button } from "../ui/Button";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard", projects: "Projects",
  analytics: "Analytics", team: "Team", settings: "Settings",
};

export function Header() {
  const { state, dispatch, toggleTheme } = useApp();

  return (
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
        <Button
          variant="ghost" size="sm"
          onClick={toggleTheme}
          title="Toggle theme"
          icon={<span>{state.theme === "dark" ? "☀️" : "🌙"}</span>}
        >
          {state.theme === "dark" ? "Light" : "Dark"}
        </Button>

        <button style={{
          position: "relative", background: "none", border: "none",
          color: "var(--text-secondary)", cursor: "pointer", fontSize: 18, padding: 6, display: "flex",
        }}>
          🔔
          <span style={{
            position: "absolute", top: 4, right: 4,
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--danger)", border: "2px solid var(--bg-surface)",
          }} />
        </button>
      </div>
    </header>
  );
}
