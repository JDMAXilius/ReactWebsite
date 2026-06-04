// Compound Component pattern — Ch05
import { createContext, useContext, type ReactNode } from "react";

const CardCtx = createContext<{ padded: boolean }>({ padded: true });

type CardProps = { children: ReactNode; style?: React.CSSProperties; padded?: boolean; hoverable?: boolean };

function Card({ children, style, padded = true, hoverable = false }: CardProps) {
  return (
    <CardCtx.Provider value={{ padded }}>
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          transition: hoverable ? "border-color 0.2s, transform 0.2s" : undefined,
          ...style,
        }}
        onMouseEnter={hoverable ? e => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
          e.currentTarget.style.transform = "translateY(-1px)";
        } : undefined}
        onMouseLeave={hoverable ? e => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "none";
        } : undefined}
      >
        {children}
      </div>
    </CardCtx.Provider>
  );
}

function Header({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  const { padded } = useContext(CardCtx);
  return (
    <div style={{
      padding: padded ? "16px 20px" : 0,
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Body({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  const { padded } = useContext(CardCtx);
  return <div style={{ padding: padded ? "20px" : 0, ...style }}>{children}</div>;
}

function Footer({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  const { padded } = useContext(CardCtx);
  return (
    <div style={{
      padding: padded ? "12px 20px" : 0,
      borderTop: "1px solid var(--border)",
      ...style,
    }}>
      {children}
    </div>
  );
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export { Card };
