// Ch03 — The Virtual DOM
// Covers: Real DOM pitfalls, React Elements, Virtual DOM vs Real DOM, efficient updates

import { useState, useRef } from "react";
import { Section, Code, Note, Divider } from "../../components/Lab";

// ── Real DOM vs Virtual DOM cost demo ─────────────────────────────────────
function DomCostDemo() {
  const [realMs, setRealMs] = useState<number | null>(null);
  const [vdomMs, setVdomMs] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function benchmarkRealDom() {
    const start = performance.now();
    const div = document.createElement("div");
    // Reading layout properties forces reflow — this is the expensive part
    for (let i = 0; i < 100; i++) {
      div.style.width = `${i}px`;
      void div.offsetWidth; // force reflow
    }
    setRealMs(+(performance.now() - start).toFixed(2));
  }

  function benchmarkVdom() {
    const start = performance.now();
    // Creating React elements is just creating plain objects — no DOM, no reflow
    for (let i = 0; i < 100; i++) {
      const _el = { type: "div", props: { style: { width: i } }, key: null };
      void _el;
    }
    setVdomMs(+(performance.now() - start).toFixed(2));
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={benchmarkRealDom} style={{ background: "#5a2727", border: "1px solid #7a3737", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
          Benchmark Real DOM (100 reflows)
        </button>
        <button onClick={benchmarkVdom} style={{ background: "#2d5a27", border: "1px solid #3d7a37", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
          Benchmark Virtual DOM (100 plain objects)
        </button>
      </div>
      {(realMs !== null || vdomMs !== null) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ color: "#f87171", fontSize: 12, marginBottom: 4 }}>Real DOM (100 reflows)</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{realMs ?? "—"}<span style={{ fontSize: 14 }}>ms</span></div>
          </div>
          <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ color: "#86efac", fontSize: 12, marginBottom: 4 }}>Virtual DOM (100 objects)</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{vdomMs ?? "—"}<span style={{ fontSize: 14 }}>ms</span></div>
          </div>
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

// ── React Element inspector ───────────────────────────────────────────────
function ElementInspector() {
  const element = {
    "$$typeof": "Symbol(react.element)",
    type: "button",
    key: null,
    ref: null,
    props: {
      className: "btn-primary",
      onClick: "ƒ handleClick",
      children: "Click me",
    },
    _owner: null,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>You write this JSX:</p>
        <Code>{`<button
  className="btn-primary"
  onClick={handleClick}
>
  Click me
</button>`}</Code>
        <p style={{ color: "#888", fontSize: 13, margin: "16px 0 8px" }}>React creates this object:</p>
        <Code>{JSON.stringify(element, null, 2)}</Code>
      </div>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Key properties explained:</p>
        {[
          { key: "$$typeof", color: "#f87171", desc: "Symbol that prevents XSS via JSON injection — plain JSON cannot contain Symbols" },
          { key: "type", color: "#fbbf24", desc: "String → DOM element. Function → React component. React.Fragment → no DOM node" },
          { key: "key", color: "#a5f3fc", desc: "Helps reconciler identify which items changed in lists. Must be stable, not index" },
          { key: "props.children", color: "#86efac", desc: "Can be a string, element, array, or null. This is what you render between tags" },
        ].map((item) => (
          <div key={item.key} style={{ marginBottom: 12, padding: 12, background: "#1a1a2e", borderRadius: 8 }}>
            <code style={{ color: item.color }}>{item.key}</code>
            <p style={{ color: "#aaa", fontSize: 12, margin: "4px 0 0", lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Efficient Updates Demo ────────────────────────────────────────────────
function EfficientUpdatesDemo() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>React's diffing in action:</p>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
          <p style={{ margin: "0 0 8px", color: "#888", fontSize: 13 }}>Component renders: <strong style={{ color: "#7b8cde" }}>{renderCount.current}</strong></p>
          <p style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Count: {count}</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#aaa" }}>This paragraph never changes — React won't touch its DOM node.</p>
          <button
            onClick={() => setCount((c) => c + 1)}
            style={{ background: "#7b8cde", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}
          >
            Increment
          </button>
        </div>
      </div>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>What React does on each update:</p>
        <Code>{`// 1. Re-run the component function
//    → new React Element tree (cheap!)
// 2. Diff new tree vs previous tree
//    → find minimal DOM operations
// 3. Commit only what changed
//    → only the text node "Count: N"
//    → static paragraph: SKIPPED ✓

// Real DOM operations: just 1 text update
// Even though the whole function re-ran`}</Code>
        <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8, padding: 12, marginTop: 12, fontSize: 13, color: "#86efac" }}>
          Open DevTools → Elements → click Increment.
          Watch: only the count text node flashes. The static paragraph never highlights.
        </div>
      </div>
    </div>
  );
}

export default function Ch03() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 3 — The Virtual DOM</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>React Elements are cheap plain objects. The Virtual DOM is React's in-memory representation of the UI used for diffing.</p>

      <Section title="Why Not Just Use the Real DOM?" subtitle="The cost of direct DOM manipulation">
        <DomCostDemo />
        <Note>
          The real DOM is expensive because every DOM node inherits hundreds of properties and reading layout
          properties (offsetWidth, getBoundingClientRect) forces the browser to calculate layout synchronously.
          React Elements are plain JS objects — creating 1000 of them costs less than one DOM reflow.
        </Note>
      </Section>

      <Divider />

      <Section title="Anatomy of a React Element" subtitle="What JSX actually creates">
        <ElementInspector />
        <Note>
          $$typeof is a Symbol — a security feature. If an attacker injects JSON (which can't contain Symbols)
          into your app as a React element, React will reject it. This prevents a specific class of XSS attacks.
        </Note>
      </Section>

      <Divider />

      <Section title="Efficient DOM Updates" subtitle="React commits only the minimum necessary changes">
        <EfficientUpdatesDemo />
        <Code>{`// Document Fragments — what React does internally
const fragment = document.createDocumentFragment();
// Build the entire new subtree off-screen...
fragment.appendChild(newNode);
// ...then insert in ONE operation
document.body.appendChild(fragment);
// = one reflow instead of N reflows`}</Code>
        <Note>
          The Virtual DOM isn't magic — it's a bookkeeping strategy. React keeps a tree of elements in memory,
          diffs it on each render, and batches DOM mutations. Chapter 4 covers exactly how this diff works (Fiber).
        </Note>
      </Section>
    </div>
  );
}
