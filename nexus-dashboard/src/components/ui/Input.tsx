// React 19: ref-as-prop — forwardRef is no longer needed
import { type InputHTMLAttributes, type Ref } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string; error?: string; icon?: React.ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function Input({ label, error, icon, style, ref, ...rest }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-muted)", display: "flex", pointerEvents: "none",
          }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          style={{
            width: "100%",
            background: "var(--bg-elevated)",
            border: `1px solid ${error ? "var(--danger)" : "var(--border-strong)"}`,
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            padding: icon ? "8px 12px 8px 34px" : "8px 12px",
            fontSize: 13,
            outline: "none",
            transition: "border-color 0.15s",
            ...style,
          }}
          onFocus={e => e.target.style.borderColor = "var(--primary)"}
          onBlur={e => e.target.style.borderColor = error ? "var(--danger)" : "var(--border-strong)"}
          {...rest}
        />
      </div>
      {error && <span style={{ fontSize: 11, color: "var(--danger)" }}>{error}</span>}
    </div>
  );
}
