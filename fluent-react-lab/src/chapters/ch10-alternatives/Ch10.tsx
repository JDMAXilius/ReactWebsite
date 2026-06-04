// Ch10 — React Alternatives
// Covers: Vue, Angular, Svelte, Solid, Qwik — what React IS and isn't,
//         React is NOT reactive, React Compiler (Forget), Future of React

import { useState } from "react";
import { Section, Code, Note, Divider } from "../../components/Lab";

const frameworks = [
  {
    name: "Vue.js",
    color: "#42b883",
    tagline: "Progressive Framework",
    reactivity: "Signals-based (via Proxy)",
    rendering: "Virtual DOM",
    bundle: "~34KB",
    killer: "Easier learning curve, better two-way binding with v-model",
    code: `// Vue 3 Composition API (Signals)
const count = ref(0); // reactive by default
const doubled = computed(() => count.value * 2);

// Template auto-tracks dependencies
<template>
  <button @click="count++">{{ count }}</button>
  <p>Doubled: {{ doubled }}</p>
</template>
// No useMemo needed — fine-grained reactivity`,
  },
  {
    name: "Angular",
    color: "#dd0031",
    tagline: "Platform for Enterprise",
    reactivity: "Zone.js + Signals (v17+)",
    rendering: "Incremental DOM",
    bundle: "~130KB",
    killer: "TypeScript-first, full framework (router, forms, DI all built-in)",
    code: `// Angular Signals (v17+)
count = signal(0);
doubled = computed(() => this.count() * 2);

// Template:
<button (click)="count.set(count()+1)">
  {{ count() }}
</button>
// Change detection now signals-based
// — much better performance than Zone.js`,
  },
  {
    name: "Svelte",
    color: "#ff3e00",
    tagline: "Cybernetically Enhanced",
    reactivity: "Runes (compile-time signals, v5)",
    rendering: "No Virtual DOM — direct DOM",
    bundle: "~2KB runtime",
    killer: "Zero virtual DOM overhead, smallest bundle, most readable syntax",
    code: `<!-- Svelte 5 with Runes -->
<script>
  let count = $state(0);       // Rune
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
  Count: {count}
</button>
<p>Doubled: {doubled}</p>
<!-- Compiler generates surgical DOM updates
     No diffing — direct assignments! -->`,
  },
  {
    name: "Solid.js",
    color: "#446b9e",
    tagline: "Simple and Performant",
    reactivity: "Fine-grained signals",
    rendering: "No Virtual DOM — JSX compiles to direct DOM",
    bundle: "~7KB",
    killer: "React-like JSX but with true reactivity — no Virtual DOM overhead",
    code: `// Solid looks like React but IS reactive
import { createSignal, createMemo } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count()} (doubled: {doubled()})
    </button>
  );
}
// Components run ONCE — only signals re-run`,
  },
  {
    name: "Qwik",
    color: "#ac7ef4",
    tagline: "O(1) Loading",
    reactivity: "Signals",
    rendering: "Resumability (no hydration)",
    bundle: "~1KB initial JS",
    killer: "Zero hydration cost — serializes execution state to HTML, resumes on interaction",
    code: `// Qwik: resumability, not hydration
import { component$, useSignal } from '@builder.io/qwik';

export const Counter = component$(() => {
  const count = useSignal(0);
  return (
    <button onClick$={() => count.value++}>
      {count.value}
    </button>
  );
});
// $ suffix = lazy-loadable boundary
// Button handler is NOT downloaded until clicked`,
  },
];

function FrameworkExplorer() {
  const [selected, setSelected] = useState(0);
  const fw = frameworks[selected];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {frameworks.map((f, i) => (
          <button key={i} onClick={() => setSelected(i)}
            style={{ background: selected === i ? f.color + "22" : "#1a1a2e", border: `1px solid ${selected === i ? f.color : "#2a2a4a"}`, color: selected === i ? f.color : "#888", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: selected === i ? 700 : 400 }}>
            {f.name}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
          <h3 style={{ color: fw.color, margin: "0 0 4px" }}>{fw.name}</h3>
          <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>{fw.tagline}</p>
          {[["Reactivity", fw.reactivity], ["Rendering", fw.rendering], ["Min Bundle", fw.bundle]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #2a2a4a", fontSize: 13 }}>
              <span style={{ color: "#888" }}>{k}</span>
              <span style={{ color: fw.color }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 12, background: "#0d0d1a", borderRadius: 6 }}>
            <p style={{ color: "#fbbf24", fontSize: 12, margin: "0 0 4px" }}>Why use this instead of React?</p>
            <p style={{ color: "#aaa", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{fw.killer}</p>
          </div>
        </div>
        <Code>{fw.code}</Code>
      </div>
    </div>
  );
}

function ReactIsNotReactive() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>React — "pull" model (re-renders whole component)</p>
          <Code>{`function Counter() {
  const [count, setCount] = useState(0);
  const doubled = count * 2; // computed every render

  // On click: ENTIRE function re-runs
  // React diffs all JSX output
  // DOM updates for only what changed

  return (
    <div>
      <button onClick={() => setCount(c=>c+1)}>
        {count}
      </button>
      <p>{doubled}</p>
    </div>
  );
}`}</Code>
        </div>
        <div>
          <p style={{ color: "#86efac", fontSize: 13, marginBottom: 8 }}>Solid.js — "push" model (only signal subscribers re-run)</p>
          <Code>{`function Counter() {
  const [count, setCount] = createSignal(0);
  const doubled = createMemo(() => count() * 2);

  // Component runs ONCE on mount.
  // On click: ONLY count() and doubled()
  // expressions re-evaluate surgically.
  // No Virtual DOM, no diffing.

  return (
    <div>
      <button onClick={() => setCount(c=>c+1)}>
        {count()}
      </button>
      <p>{doubled()}</p>
    </div>
  );
}`}</Code>
        </div>
      </div>
      <Note>
        "React is NOT Reactive" — Tejas Kumar, Fluent React Ch.10.
        Reactive systems (Signals) track dependencies automatically and update only the affected computations.
        React uses a "pull" model: you tell React state changed, React re-renders the component, React diffs.
        This is simpler to reason about but less efficient by default — hence why React needs the Compiler.
      </Note>
    </div>
  );
}

function ReactFuture() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#7b8cde", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>React Compiler (React Forget)</p>
        <Code>{`// You write this:
function ProductCard({ product }) {
  const price = formatPrice(product.price);
  return <div>{price}</div>;
}

// Compiler outputs (conceptually):
function ProductCard({ product }) {
  const price = useMemo(
    () => formatPrice(product.price),
    [product.price]
  );
  return <div>{price}</div>;
}
// Auto-memoization at build time
// No more manual useMemo/useCallback
// Reached stable v1.0 in Oct 2025`}</Code>
      </div>
      <div>
        <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>The Convergence</p>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 1.7, color: "#aaa" }}>
          <p>The frameworks are converging:</p>
          <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
            <li>Angular added Signals (v17)</li>
            <li>Vue always had them (reactivity system)</li>
            <li>Svelte added Runes (compile-time signals)</li>
            <li>React added the Compiler (auto-memoization)</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            The end goal is the same: only update what changed.
            React achieves it at build time via the Compiler.
            Solid/Vue achieve it at runtime via Signals.
            Different tradeoffs, same destination.
          </p>
        </div>
        <Note>
          "React Forget" was the internal name for the React Compiler.
          The name means: forget about useMemo and useCallback — the compiler handles it.
        </Note>
      </div>
    </div>
  );
}

function CommonPatterns() {
  const patterns = [
    { pattern: "Component-Based Architecture", react: "JSX + function components", others: "All modern frameworks" },
    { pattern: "Declarative Syntax", react: "JSX templates", others: "Svelte templates, Vue templates, Angular HTML" },
    { pattern: "Reactive Updates", react: "setState → re-render → diff", others: "Signals → surgical DOM updates" },
    { pattern: "Lifecycle", react: "useEffect (mount/cleanup)", others: "onMount/onDestroy primitives" },
    { pattern: "Ecosystem", react: "Largest by far", others: "Growing but smaller" },
    { pattern: "Compiler Optimization", react: "React Compiler (2025)", others: "Svelte (always), Angular Ivy" },
  ];

  return (
    <div style={{ background: "#1a1a2e", borderRadius: 8, overflow: "hidden" }}>
      {[["Pattern", "React", "Alternatives"], ...patterns.map(p => [p.pattern, p.react, p.others])].map((row, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr", borderBottom: "1px solid #2a2a4a" }}>
          {row.map((cell, j) => (
            <div key={j} style={{ padding: "10px 14px", fontSize: i === 0 ? 12 : 13, color: i === 0 ? "#888" : j === 0 ? "#fff" : j === 1 ? "#7b8cde" : "#86efac", fontWeight: i === 0 ? 700 : 400 }}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Ch10() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 10 — React Alternatives</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>Vue, Angular, Svelte, Solid, and Qwik — what they do differently, and why React's model is both its strength and limitation.</p>

      <Section title="Framework Explorer" subtitle="Click each framework to see its reactivity model, bundle size, and code style">
        <FrameworkExplorer />
      </Section>

      <Divider />

      <Section title="Common Patterns Across Frameworks" subtitle="All component frameworks solve the same problems">
        <CommonPatterns />
      </Section>

      <Divider />

      <Section title="React Is NOT Reactive" subtitle="The fundamental difference between React and signal-based frameworks">
        <ReactIsNotReactive />
      </Section>

      <Divider />

      <Section title="The Future: React Compiler & Convergence" subtitle="How React is bridging the gap with signals">
        <ReactFuture />
      </Section>
    </div>
  );
}
