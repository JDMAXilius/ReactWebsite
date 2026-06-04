// Ch02 — JSX
// Covers: JSX Pragma, how JSX compiles, expressions, benefits vs drawbacks

import { useState } from "react";
import { Section, Code, Note, Divider } from "../../components/Lab";

// ── Live JSX → createElement visualizer ───────────────────────────────────
const examples = [
  {
    label: "Simple element",
    jsx: `<h1 className="title">Hello</h1>`,
    compiled: `React.createElement(
  "h1",
  { className: "title" },
  "Hello"
)`,
    output: <h1 style={{ margin: 0, fontSize: 18 }}>Hello</h1>,
  },
  {
    label: "Nested elements",
    jsx: `<div>
  <p>Count: {count}</p>
  <button onClick={inc}>+</button>
</div>`,
    compiled: `React.createElement(
  "div", null,
  React.createElement("p", null, "Count: ", count),
  React.createElement("button", { onClick: inc }, "+")
)`,
    output: <div><p style={{ margin: 0 }}>Count: 42</p><button style={{ marginTop: 4 }}>+</button></div>,
  },
  {
    label: "Component (capital = component)",
    jsx: `<MyButton variant="primary">
  Click me
</MyButton>`,
    compiled: `React.createElement(
  MyButton,          // ← function ref, not string!
  { variant: "primary" },
  "Click me"
)`,
    output: <div style={{ background: "#7b8cde", color: "#fff", padding: "6px 14px", borderRadius: 6, display: "inline-block" }}>Click me</div>,
  },
  {
    label: "Fragment shorthand",
    jsx: `<>
  <Header />
  <Main />
</>`,
    compiled: `React.createElement(
  React.Fragment, null,
  React.createElement(Header, null),
  React.createElement(Main, null)
)`,
    output: <><span style={{ color: "#7b8cde" }}>Header</span> · <span style={{ color: "#86efac" }}>Main</span></>,
  },
];

function JsxCompiler() {
  const [selected, setSelected] = useState(0);
  const ex = examples[selected];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {examples.map((e, i) => (
          <button
            key={i} onClick={() => setSelected(i)}
            style={{ background: selected === i ? "#7b8cde" : "#1a1a2e", border: "1px solid #2a2a4a", color: "#fff", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
          >
            {e.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <p style={{ color: "#f87171", fontSize: 12, margin: "0 0 6px" }}>You write (JSX)</p>
          <Code>{ex.jsx}</Code>
        </div>
        <div>
          <p style={{ color: "#a5f3fc", fontSize: 12, margin: "0 0 6px" }}>Babel compiles to</p>
          <Code>{ex.compiled}</Code>
        </div>
      </div>
      <div style={{ marginTop: 12, padding: 16, background: "#1a1a2e", borderRadius: 8 }}>
        <p style={{ color: "#888", fontSize: 12, margin: "0 0 8px" }}>Rendered output</p>
        {ex.output}
      </div>
    </div>
  );
}

// ── JSX Expressions Demo ──────────────────────────────────────────────────
function ExpressionsDemo() {
  const [name, setName] = useState("World");
  const [show, setShow] = useState(true);
  const items = ["Apple", "Banana", "Cherry"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <Code>{`// Any JS expression inside { } works
<h1>Hello, {name.toUpperCase()}!</h1>
// Conditional rendering
{show && <Alert />}
{isAdmin ? <AdminPanel /> : <UserPanel />}
// List rendering
{items.map((item, i) => <li key={i}>{item}</li>)}`}</Code>
      </div>
      <div style={{ background: "#1a1a2e", padding: 16, borderRadius: 8 }}>
        <p style={{ margin: "0 0 8px" }}>Hello, <strong style={{ color: "#7b8cde" }}>{name.toUpperCase()}</strong>!</p>
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          style={{ background: "#0d0d1a", border: "1px solid #2a2a4a", color: "#fff", padding: "4px 8px", borderRadius: 4, marginBottom: 12, width: "100%" }}
          placeholder="Type a name..."
        />
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, marginBottom: 12 }}>
          <input type="checkbox" checked={show} onChange={() => setShow(!show)} />
          Show list
        </label>
        {show && <ul style={{ margin: 0, paddingLeft: 20 }}>{items.map((item, i) => <li key={i} style={{ color: "#86efac" }}>{item}</li>)}</ul>}
      </div>
    </div>
  );
}

// ── JSX Pragma ────────────────────────────────────────────────────────────
function PragmaDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Old pragma (React 16 and before)</p>
        <Code>{`/** @jsx React.createElement */
// Must import React in every file!
import React from 'react';

function App() {
  return <div>Hello</div>;
}`}</Code>
      </div>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>New JSX Transform (React 17+)</p>
        <Code>{`// tsconfig.json / babel config:
{ "jsx": "react-jsx" }

// No import React needed — compiler
// auto-imports from 'react/jsx-runtime'
function App() {
  return <div>Hello</div>;
}`}</Code>
      </div>
    </div>
  );
}

export default function Ch02() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 2 — JSX</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>JSX is syntactic sugar over React.createElement. Understanding the compilation reveals how React works.</p>

      <Section title="JSX → createElement Compiler" subtitle="Select an example to see what Babel produces">
        <JsxCompiler />
        <Note>
          JSX is not a template language — it's syntax sugar. Every JSX element becomes a React.createElement() call.
          Capital letters mean components (function references), lowercase means DOM strings.
          The new JSX transform (React 17+) eliminates the need to import React in every file.
        </Note>
      </Section>

      <Divider />

      <Section title="JSX Expressions" subtitle="Everything inside { } is a JavaScript expression">
        <ExpressionsDemo />
        <Note>
          JSX allows any JS expression in curly braces — but NOT statements (if/for/while).
          Use ternaries for conditionals, .map() for lists. Keys must be stable and unique among siblings.
        </Note>
      </Section>

      <Divider />

      <Section title="The JSX Pragma" subtitle="How the compiler knows what function to call">
        <PragmaDemo />
        <Code>{`// What createElement actually returns — a React Element (plain object):
{
  type: "h1",           // string for DOM, function for components
  props: {
    className: "title",
    children: "Hello"
  },
  key: null,
  ref: null,
  $$typeof: Symbol(react.element)  // tamper-proof marker
}`}</Code>
        <Note>
          React Elements are plain JavaScript objects — not DOM nodes. They're cheap to create.
          React reads these objects to decide what DOM mutations to make. This is the foundation of the Virtual DOM.
        </Note>
      </Section>
    </div>
  );
}
