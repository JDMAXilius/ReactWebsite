import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--primary)", color: "#fff", border: "1px solid transparent" },
  secondary: { background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-strong)" },
  ghost: { background: "transparent", color: "var(--text-secondary)", border: "1px solid transparent" },
  danger: { background: "var(--danger-dim)", color: "var(--danger)", border: "1px solid transparent" },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: "5px 12px", fontSize: 12, borderRadius: "var(--radius-sm)" },
  md: { padding: "7px 16px", fontSize: 13, borderRadius: "var(--radius-md)" },
  lg: { padding: "10px 22px", fontSize: 14, borderRadius: "var(--radius-md)" },
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant; size?: Size; icon?: React.ReactNode;
};

export function Button({ variant = "secondary", size = "md", icon, children, style, ...rest }: Props) {
  return (
    <button
      {...rest}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontWeight: 500, cursor: "pointer", transition: "opacity 0.15s",
        ...variantStyles[variant], ...sizeStyles[size], ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </button>
  );
}
