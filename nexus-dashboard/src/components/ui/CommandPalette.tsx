// createPortal + useDeferredValue — Cmd/Ctrl+K command palette
import { useState, useEffect, useDeferredValue, useMemo } from "react";
import { createPortal } from "react-dom";
import { useApp } from "../../context/AppContext";
import type { Page } from "../../context/AppContext";

const NAV: { id: string; label: string; icon: string; page: Page }[] = [
  { id: "nav-dashboard", label: "Dashboard",  icon: "◈", page: "dashboard"  },
  { id: "nav-projects",  label: "Projects",   icon: "◫", page: "projects"   },
  { id: "nav-analytics", label: "Analytics",  icon: "◉", page: "analytics"  },
  { id: "nav-team",      label: "Team",       icon: "◎", page: "team"       },
  { id: "nav-settings",  label: "Settings",   icon: "◌", page: "settings"   },
];

export function CommandPalette() {
  const { navigate, state } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
        setQuery("");
        setActiveIdx(0);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const projectCmds = useMemo(() =>
    state.projects.map(p => ({ id: `p-${p.id}`, label: p.name, icon: "◷", page: "projects" as Page })),
    [state.projects]
  );

  const filtered = useMemo(() => {
    const q = deferred.toLowerCase().trim();
    const all = [...NAV, ...projectCmds];
    return q ? all.filter(c => c.label.toLowerCase().includes(q)) : NAV;
  }, [deferred, projectCmds]);

  function select(page: Page) {
    navigate(page);
    setOpen(false);
    setQuery("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && filtered[activeIdx]) select(filtered[activeIdx].page);
    if (e.key === "Escape") setOpen(false);
  }

  if (!open) return null;

  return createPortal(
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "15vh",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 500, background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)", borderRadius: "var(--radius-lg)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          overflow: "hidden", animation: "paletteIn 0.15s ease",
        }}
      >
        {/* Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--text-muted)", fontSize: 16 }}>⌕</span>
          <input
            autoFocus
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKey}
            placeholder="Search pages or projects…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "var(--text-primary)" }}
          />
          <kbd style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border-strong)", borderRadius: 4, padding: "2px 6px" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 340, overflowY: "auto" }}>
          {!query && (
            <div style={{ padding: "8px 16px 4px", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pages</div>
          )}
          {deferred !== query && (
            <div style={{ padding: "8px 16px", fontSize: 12, color: "var(--text-muted)" }}>Searching…</div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => select(cmd.page)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "10px 16px", border: "none", textAlign: "left",
                background: i === activeIdx ? "var(--bg-hover)" : "transparent",
                color: "var(--text-primary)", cursor: "pointer", fontSize: 13,
                borderLeft: `2px solid ${i === activeIdx ? "var(--primary)" : "transparent"}`,
                transition: "background 0.1s",
              }}
            >
              <span style={{ color: "var(--primary)", width: 18, flexShrink: 0 }}>{cmd.icon}</span>
              <span style={{ flex: 1 }}>{cmd.label}</span>
              {state.page === cmd.page && !query && (
                <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "2px 6px", borderRadius: 4 }}>current</span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No results for "{query}"</div>
          )}
        </div>

        {/* Footer hints */}
        <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 16, fontSize: 11, color: "var(--text-muted)" }}>
          <span>↑↓ navigate</span><span>↵ select</span><span>⌘K close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
