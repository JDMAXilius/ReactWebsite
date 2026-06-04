type Variant = "success" | "warning" | "danger" | "info" | "primary" | "default";

const styles: Record<Variant, { bg: string; color: string }> = {
  success: { bg: "var(--success-dim)", color: "var(--success)" },
  warning: { bg: "var(--warning-dim)", color: "var(--warning)" },
  danger:  { bg: "var(--danger-dim)",  color: "var(--danger)"  },
  info:    { bg: "var(--info-dim)",    color: "var(--info)"    },
  primary: { bg: "var(--primary-dim)", color: "var(--primary)" },
  default: { bg: "var(--bg-elevated)", color: "var(--text-secondary)" },
};

type Props = { variant?: Variant; children: React.ReactNode; dot?: boolean };

export function Badge({ variant = "default", children, dot }: Props) {
  const s = styles[variant];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 9px", borderRadius: 99,
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />}
      {children}
    </span>
  );
}
