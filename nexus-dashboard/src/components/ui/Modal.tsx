// Compound Component pattern — Ch05
import { createContext, useContext, useEffect, type ReactNode } from "react";

const ModalCtx = createContext<{ onClose: () => void }>({ onClose: () => {} });

type ModalProps = { open: boolean; onClose: () => void; children: ReactNode; width?: number };

function Modal({ open, onClose, children, width = 480 }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ModalCtx.Provider value={{ onClose }}>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--bg-surface)", border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-lg)", width: "100%", maxWidth: width,
            boxShadow: "var(--shadow)",
          }}
        >
          {children}
        </div>
      </div>
    </ModalCtx.Provider>
  );
}

function Header({ children }: { children: ReactNode }) {
  const { onClose } = useContext(ModalCtx);
  return (
    <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontWeight: 600, fontSize: 15 }}>{children}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 18, cursor: "pointer", padding: 2, lineHeight: 1 }}>✕</button>
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <div style={{ padding: "20px" }}>{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, justifyContent: "flex-end" }}>{children}</div>;
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
export { Modal };
