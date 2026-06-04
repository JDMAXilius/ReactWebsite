import { useState, lazy, Suspense } from "react";

const chapters = [
  { id: 1, title: "Entry-Level Stuff", subtitle: "Why React exists & Flux", emoji: "🏗️", component: lazy(() => import("./chapters/ch01-entry-level/Ch01")) },
  { id: 2, title: "JSX", subtitle: "JavaScript XML under the hood", emoji: "🔤", component: lazy(() => import("./chapters/ch02-jsx/Ch02")) },
  { id: 3, title: "The Virtual DOM", subtitle: "React Elements & efficient updates", emoji: "🌳", component: lazy(() => import("./chapters/ch03-virtual-dom/Ch03")) },
  { id: 4, title: "Inside Reconciliation", subtitle: "Fiber, batching & double buffering", emoji: "🔄", component: lazy(() => import("./chapters/ch04-reconciliation/Ch04")) },
  { id: 5, title: "Patterns", subtitle: "memo, useMemo, 6 design patterns", emoji: "🧩", component: lazy(() => import("./chapters/ch05-patterns/Ch05")) },
  { id: 6, title: "Server-Side React", subtitle: "SSR, hydration & streaming", emoji: "🖥️", component: lazy(() => import("./chapters/ch06-ssr/Ch06")) },
  { id: 7, title: "Concurrent React", subtitle: "Scheduler, Lanes, Transitions", emoji: "⚡", component: lazy(() => import("./chapters/ch07-concurrent/Ch07")) },
  { id: 8, title: "Frameworks", subtitle: "Next.js vs Remix trade-offs", emoji: "🚀", component: lazy(() => import("./chapters/ch08-frameworks/Ch08")) },
  { id: 9, title: "React Server Components", subtitle: "RSC rules & Server Actions", emoji: "🗄️", component: lazy(() => import("./chapters/ch09-rsc/Ch09")) },
  { id: 10, title: "React Alternatives", subtitle: "Vue, Svelte, Solid, Qwik vs React", emoji: "🔀", component: lazy(() => import("./chapters/ch10-alternatives/Ch10")) },
];

export default function App() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const active = chapters.find((c) => c.id === activeChapter);
  const ActiveComponent = active?.component;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#0f0f0f", color: "#e8e8e8" }}>
      <header style={{ background: "#1a1a2e", padding: "20px 32px", borderBottom: "1px solid #2a2a4a", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => setActiveChapter(null)} style={{ background: "none", border: "none", color: "#7b8cde", fontSize: 22, cursor: "pointer", padding: 0 }}>
          ⚛
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>Fluent React Lab</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#7b8cde" }}>Tejas Kumar · O'Reilly · Interactive Study Guide</p>
        </div>
        {active && (
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#aaa" }}>
            Ch {active.id}: {active.title}
          </span>
        )}
      </header>

      {!activeChapter ? (
        <main style={{ padding: "40px 32px", maxWidth: 960, margin: "0 auto" }}>
          <p style={{ color: "#888", marginBottom: 32, lineHeight: 1.6 }}>
            Interactive implementations of every concept in <em>Fluent React</em> by Tejas Kumar.
            Each chapter has runnable demos — read the book, then experiment here.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(ch.id)}
                style={{
                  background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12,
                  padding: "20px 24px", textAlign: "left", cursor: "pointer", color: "inherit",
                  transition: "border-color 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7b8cde"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a4a"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{ch.emoji}</div>
                <div style={{ fontSize: 12, color: "#7b8cde", marginBottom: 4 }}>Chapter {ch.id}</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{ch.title}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{ch.subtitle}</div>
              </button>
            ))}
          </div>
        </main>
      ) : (
        <main style={{ padding: "32px", maxWidth: 1000, margin: "0 auto" }}>
          <button
            onClick={() => setActiveChapter(null)}
            style={{ background: "none", border: "1px solid #2a2a4a", color: "#7b8cde", padding: "6px 14px", borderRadius: 6, cursor: "pointer", marginBottom: 24, fontSize: 13 }}
          >
            ← All Chapters
          </button>
          <Suspense fallback={<div style={{ color: "#888", padding: 40, textAlign: "center" }}>Loading chapter...</div>}>
            {ActiveComponent && <ActiveComponent />}
          </Suspense>
        </main>
      )}
    </div>
  );
}
