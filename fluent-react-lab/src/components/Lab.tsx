// Shared UI primitives for the Fluent React Lab

export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: 16 }}>{title}</h3>
      {subtitle && <p style={{ color: "#666", fontSize: 13, margin: "0 0 16px" }}>{subtitle}</p>}
      {children}
    </section>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre style={{
      background: "#0d0d1a", border: "1px solid #2a2a4a", borderRadius: 8,
      padding: "16px", fontSize: 13, lineHeight: 1.6, overflowX: "auto",
      color: "#a5f3fc", margin: "8px 0", fontFamily: "monospace",
    }}>
      {children}
    </pre>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8,
      padding: "12px 16px", marginTop: 12, fontSize: 13, color: "#86efac", lineHeight: 1.6,
    }}>
      <strong>📖 Book note: </strong>{children}
    </div>
  );
}

export function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #2a2a4a", margin: "32px 0" }} />;
}

export function Badge({ color, children }: { color: string; children: string }) {
  return (
    <span style={{ background: color + "22", border: `1px solid ${color}44`, color, borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>
      {children}
    </span>
  );
}
