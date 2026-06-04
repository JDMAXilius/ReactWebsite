// Ch05 — Common Questions and Powerful Patterns
// Covers: React.memo, useMemo, Suspense, useState vs useReducer,
//         HOC, Render Props, Control Props, Prop Collections,
//         Compound Components, State Reducer pattern

import { useState, useReducer, memo } from "react";
import { Section, Code, Note, Divider } from "../../components/Lab";

// ── 1. React.memo Demo ────────────────────────────────────────────────────
const ExpensiveChild = memo(function ExpensiveChild({ value }: { value: number }) {
  return (
    <div style={{ background: "#1e2a1e", border: "1px solid #2a4a2a", borderRadius: 8, padding: 12, fontSize: 13 }}>
      <span style={{ color: "#86efac" }}>Memoized child</span> — value: <strong>{value}</strong>
      <span style={{ color: "#555", marginLeft: 8 }}>(re-renders only when value changes)</span>
    </div>
  );
});

function MemoDemo() {
  const [count, setCount] = useState(0);
  const [noise, setNoise] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => setNoise((n) => n + 1)} style={{ background: "#5a2727", border: "1px solid #7a3737", color: "#fff", padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>
          Noise: {noise} (won't re-render child)
        </button>
        <button onClick={() => setCount((c) => c + 1)} style={{ background: "#2d5a27", border: "1px solid #3d7a37", color: "#fff", padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>
          Value: {count} (will re-render child)
        </button>
      </div>
      <ExpensiveChild value={count} />
      <Code>{`const Child = memo(function Child({ value }) {
  return <div>{value}</div>;
});
// Child re-renders ONLY when 'value' prop changes
// memo does shallow comparison of props`}</Code>
      <Note>
        React.memo is a guideline, not a rule. Memoize when: the component is expensive to render,
        it re-renders often with the same props, and the memo overhead (comparison) is less than the render cost.
        With React Compiler (React 19+), you may not need this at all.
      </Note>
    </div>
  );
}

// ── 2. HOC Pattern ────────────────────────────────────────────────────────
function withLogger<P extends object>(WrappedComponent: React.ComponentType<P>, name: string) {
  return function LoggedComponent(props: P) {
    return (
      <div style={{ border: "1px dashed #7b8cde44", borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 11, color: "#7b8cde", marginBottom: 8 }}>HOC: withLogger({name})</div>
        <WrappedComponent {...props} />
      </div>
    );
  };
}

function SimpleButton({ label }: { label: string }) {
  return <button style={{ background: "#7b8cde", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>{label}</button>;
}
const LoggedButton = withLogger(SimpleButton, "SimpleButton");

// ── 3. Render Props ───────────────────────────────────────────────────────
function DataProvider({ render }: { render: (data: { items: string[]; loading: boolean }) => React.ReactNode }) {
  const items = ["Alpha", "Beta", "Gamma"];
  return <>{render({ items, loading: false })}</>;
}

// ── 4. Compound Components ────────────────────────────────────────────────
import { createContext, useContext } from "react";

const TabCtx = createContext<{ active: string; setActive: (t: string) => void }>({ active: "", setActive: () => {} });

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab);
  return <TabCtx.Provider value={{ active, setActive }}><div>{children}</div></TabCtx.Provider>;
}
Tabs.List = function TabList({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #2a2a4a", marginBottom: 16 }}>{children}</div>;
};
Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const { active, setActive } = useContext(TabCtx);
  return (
    <button
      onClick={() => setActive(id)}
      style={{ background: "none", border: "none", color: active === id ? "#7b8cde" : "#888", padding: "8px 16px", cursor: "pointer", borderBottom: active === id ? "2px solid #7b8cde" : "2px solid transparent", fontSize: 14 }}
    >
      {children}
    </button>
  );
};
Tabs.Panel = function Panel({ id, children }: { id: string; children: React.ReactNode }) {
  const { active } = useContext(TabCtx);
  if (active !== id) return null;
  return <div style={{ padding: 12, background: "#1a1a2e", borderRadius: 8 }}>{children}</div>;
};

// ── 5. State Reducer Pattern ──────────────────────────────────────────────
type ToggleState = { on: boolean };
type ToggleAction = { type: "toggle" } | { type: "reset" };

function toggleReducer(state: ToggleState, action: ToggleAction): ToggleState {
  switch (action.type) {
    case "toggle": return { on: !state.on };
    case "reset":  return { on: false };
  }
}

function useToggle({ reducer = toggleReducer } = {}) {
  const [state, dispatch] = useReducer(reducer, { on: false });
  return { on: state.on, toggle: () => dispatch({ type: "toggle" }), reset: () => dispatch({ type: "reset" }) };
}

function StateReducerDemo() {
  // Consumer can override reducer behavior without changing the hook
  function noMoreThan3Toggles(state: ToggleState, action: ToggleAction): ToggleState {
    const newState = toggleReducer(state, action);
    // Override: can't turn on if counter already at 3 (not shown here for brevity)
    return newState;
  }
  const { on, toggle, reset } = useToggle({ reducer: noMoreThan3Toggles });
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ fontSize: 24 }}>{on ? "✅ ON" : "⭕ OFF"}</div>
      <button onClick={toggle} style={{ background: "#7b8cde", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>Toggle</button>
      <button onClick={reset} style={{ background: "#333", border: "1px solid #555", color: "#fff", padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>Reset</button>
      <Code>{`// Consumer passes their own reducer
// to customize behavior without
// forking the hook
useToggle({ reducer: myReducer })`}</Code>
    </div>
  );
}

// ── useState vs useReducer ─────────────────────────────────────────────────
function StateVsReducer() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#86efac", fontSize: 13, marginBottom: 8 }}>useState — simple, independent values</p>
        <Code>{`// Good for:
const [name, setName] = useState('');
const [age, setAge] = useState(0);
// Independent values, simple updates

// Anti-pattern: related state
const [x, setX] = useState(0);
const [y, setY] = useState(0);
// If x and y always update together
// → use useReducer or one object`}</Code>
      </div>
      <div>
        <p style={{ color: "#a5f3fc", fontSize: 13, marginBottom: 8 }}>useReducer — complex, related state</p>
        <Code>{`// Good for:
// - State with multiple sub-values
// - Next state depends on previous
// - Multiple actions affecting same state
// - Testing (reducer is pure function)

const [state, dispatch] = useReducer(
  reducer,
  { loading: false, data: null, error: null }
);
// All form state in one reducer`}</Code>
      </div>
    </div>
  );
}

export default function Ch05() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 5 — Common Questions & Powerful Patterns</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>Memoization strategies and the 6 core React composition patterns.</p>

      <Section title="React.memo — Skip Re-renders" subtitle="Memoize by props — use when re-renders are measurably expensive">
        <MemoDemo />
      </Section>

      <Divider />

      <Section title="useState vs useReducer" subtitle="Choose the right state primitive">
        <StateVsReducer />
      </Section>

      <Divider />

      <Section title="Higher-Order Component (HOC)" subtitle="Wrap a component to add behavior — now mostly replaced by hooks">
        <LoggedButton label="I'm wrapped in withLogger HOC" />
        <Code>{`function withLogger(WrappedComponent, name) {
  return function LoggedComponent(props) {
    console.log(\`Rendering \${name}\`);
    return <WrappedComponent {...props} />;
  };
}
const LoggedButton = withLogger(Button, 'Button');`}</Code>
        <Note>HOCs add behavior by wrapping — they're still used (connect(), withRouter()), but custom hooks handle most cases more cleanly since hooks don't add wrapper nodes to the tree.</Note>
      </Section>

      <Divider />

      <Section title="Render Props" subtitle="Share behavior by passing a render function as a prop">
        <DataProvider
          render={({ items, loading }) => (
            <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
              {loading ? <p>Loading...</p> : <ul style={{ margin: 0, paddingLeft: 20 }}>{items.map((item) => <li key={item} style={{ color: "#86efac" }}>{item}</li>)}</ul>}
            </div>
          )}
        />
        <Code>{`<DataProvider render={({ items }) => (
  <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
)} />`}</Code>
      </Section>

      <Divider />

      <Section title="Compound Components" subtitle="Components that share implicit state via context (Radix UI uses this pattern)">
        <Tabs defaultTab="jsx">
          <Tabs.List>
            <Tabs.Tab id="jsx">JSX</Tabs.Tab>
            <Tabs.Tab id="fiber">Fiber</Tabs.Tab>
            <Tabs.Tab id="hooks">Hooks</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="jsx"><p>JSX compiles to React.createElement() calls.</p></Tabs.Panel>
          <Tabs.Panel id="fiber"><p>Fiber is the unit of work in React's reconciler.</p></Tabs.Panel>
          <Tabs.Panel id="hooks"><p>Hooks let functional components use state and effects.</p></Tabs.Panel>
        </Tabs>
        <Code>{`<Tabs defaultTab="jsx">
  <Tabs.List>
    <Tabs.Tab id="jsx">JSX</Tabs.Tab>
    <Tabs.Tab id="fiber">Fiber</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="jsx">...</Tabs.Panel>
</Tabs>
// Tabs shares active state via Context internally
// Consumer API is clean — no prop drilling`}</Code>
      </Section>

      <Divider />

      <Section title="State Reducer Pattern" subtitle="Let consumers customize internal state logic by passing their own reducer">
        <StateReducerDemo />
        <Note>
          The State Reducer pattern (popularized by Kent C. Dodds) lets consumers override how internal state is updated.
          Your hook exposes the reducer contract — consumers pass their own reducer that calls the default one and then
          applies overrides. Maximum flexibility without breaking the hook's API.
        </Note>
      </Section>
    </div>
  );
}
