// React Portal pattern — createPortal renders outside the main tree
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT: Record<ToastVariant, { color: string; icon: string }> = {
  success: { color: "var(--success)", icon: "✓" },
  error:   { color: "var(--danger)",  icon: "✕" },
  info:    { color: "var(--info)",    icon: "ℹ" },
  warning: { color: "var(--warning)", icon: "⚠" },
};

function ToastEl({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const s = VARIANT[item.variant];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 16px",
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderLeft: `3px solid ${s.color}`,
      borderRadius: "var(--radius-md)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      minWidth: 280, maxWidth: 380,
      animation: "toastIn 0.2s ease",
    }}>
      <span style={{ color: s.color, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{s.icon}</span>
      <span style={{ fontSize: 13, flex: 1, color: "var(--text-primary)" }}>{item.message}</span>
      <button
        onClick={onDismiss}
        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}
      >×</button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          display: "flex", flexDirection: "column", gap: 8,
          zIndex: 9999, pointerEvents: "none",
        }}>
          {toasts.map(t => (
            <div key={t.id} style={{ pointerEvents: "all" }}>
              <ToastEl item={t} onDismiss={() => dismiss(t.id)} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
