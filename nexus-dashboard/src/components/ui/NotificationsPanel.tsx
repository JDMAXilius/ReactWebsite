// createPortal — slide-in drawer outside the main React tree
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ACTIVITY } from "../../data/mock";
import { Avatar } from "./Avatar";

interface Props {
  open: boolean;
  onClose: () => void;
}

const UNREAD = 2;

export function NotificationsPanel({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return createPortal(
    <>
      {/* Transparent click-outside overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
        />
      )}

      {/* Slide-in panel */}
      <div style={{
        position: "fixed",
        top: "var(--header-height)", right: 0, bottom: 0,
        width: 340,
        background: "var(--bg-surface)",
        borderLeft: "1px solid var(--border)",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.3)",
        zIndex: 50,
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Notifications</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{UNREAD} unread</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, padding: 2 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {ACTIVITY.map((item, i) => (
            <div
              key={item.id}
              style={{
                padding: "14px 20px", display: "flex", gap: 12, alignItems: "flex-start",
                borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--border)" : "none",
                background: i < UNREAD ? "var(--primary-dim)" : "transparent",
              }}
            >
              <Avatar initials={item.avatar} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600 }}>{item.user}</span>
                  {" "}
                  <span style={{ color: "var(--text-secondary)" }}>{item.action}</span>
                  {" "}
                  <span style={{ color: "var(--primary)", fontWeight: 500 }}>{item.target}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{item.time}</div>
              </div>
              {i < UNREAD && (
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--primary)", flexShrink: 0, marginTop: 5 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
          <button style={{
            width: "100%", padding: "8px", borderRadius: "var(--radius-sm)",
            background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
            color: "var(--text-secondary)", fontSize: 12, cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Mark all as read
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
