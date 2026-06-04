// Ch01 — The Entry-Level Stuff
// Covers: Why React, world before React (jQuery/Backbone/Knockout/Angular), Flux architecture

import { useState, useReducer } from "react";
import { Section, Code, Note, Divider } from "../../components/Lab";

// ── Flux Architecture Demo ─────────────────────────────────────────────────
// Flux: Action → Dispatcher → Store → View → (user triggers) → Action
type Action = { type: "INCREMENT" } | { type: "DECREMENT" } | { type: "RESET" };
type State = { count: number; history: string[] };

function fluxReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT": return { count: state.count + 1, history: [...state.history, `+1 → ${state.count + 1}`] };
    case "DECREMENT": return { count: state.count - 1, history: [...state.history, `-1 → ${state.count - 1}`] };
    case "RESET":     return { count: 0, history: [...state.history, "reset → 0"] };
  }
}

function FluxDemo() {
  const [state, dispatch] = useReducer(fluxReducer, { count: 0, history: [] });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Dispatcher (dispatch actions)</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => dispatch({ type: "INCREMENT" })} style={btn("#2d5a27")}>+ INCREMENT</button>
          <button onClick={() => dispatch({ type: "DECREMENT" })} style={btn("#5a2727")}>- DECREMENT</button>
          <button onClick={() => dispatch({ type: "RESET" })} style={btn("#333")}>↺ RESET</button>
        </div>
        <div style={{ marginTop: 16, padding: 16, background: "#1a1a2e", borderRadius: 8, fontSize: 32, textAlign: "center", fontWeight: 700 }}>
          {state.count}
        </div>
      </div>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Store log (action history)</p>
        <div style={{ background: "#0d0d1a", borderRadius: 8, padding: 12, maxHeight: 140, overflowY: "auto", fontSize: 12, fontFamily: "monospace" }}>
          {state.history.length === 0 && <span style={{ color: "#555" }}>No actions yet</span>}
          {state.history.map((h, i) => <div key={i} style={{ color: "#7b8cde" }}>{h}</div>)}
        </div>
      </div>
    </div>
  );
}

// ── jQuery vs React Comparison ────────────────────────────────────────────
function ImperativeVsDeclarative() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>jQuery (imperative) — you tell HOW</p>
        <Code>{`// Manually find element, toggle class
$('#modal').show();
$('#overlay').addClass('active');
$('#btn').text('Close');
// Easy to lose track of state!`}</Code>
      </div>
      <div>
        <p style={{ color: "#86efac", fontSize: 13, marginBottom: 8 }}>React (declarative) — you describe WHAT</p>
        <Code>{`// State drives the UI — always in sync
const [open, setOpen] = useState(false);
return (
  <>
    {open && <Modal />}
    <button onClick={() => setOpen(!open)}>
      {open ? 'Close' : 'Open'}
    </button>
  </>
);`}</Code>
      </div>
    </div>
  );
}

// ── React's Value Proposition ─────────────────────────────────────────────
function ValueProposition() {
  const [selected, setSelected] = useState<string | null>(null);
  const props = [
    { title: "Declarative", desc: "Describe what the UI looks like for a given state. React figures out the DOM mutations." },
    { title: "Component-Based", desc: "Encapsulated components manage their own state. Compose them for complex UIs." },
    { title: "Learn Once, Write Anywhere", desc: "React Native for mobile, React Three Fiber for 3D, React PDF for documents." },
    { title: "Unidirectional Data Flow", desc: "Data flows down (props), events flow up (callbacks). Predictable and debuggable." },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
      {props.map((p) => (
        <div
          key={p.title}
          onClick={() => setSelected(selected === p.title ? null : p.title)}
          style={{ background: selected === p.title ? "#1e2a4a" : "#1a1a2e", border: `1px solid ${selected === p.title ? "#7b8cde" : "#2a2a4a"}`, borderRadius: 8, padding: 16, cursor: "pointer" }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
          {selected === p.title && <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.5 }}>{p.desc}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Ch01() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 1 — The Entry-Level Stuff</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>Why React was created, the world before it, and the Flux architecture pattern.</p>

      <Section title="React's Value Proposition" subtitle="Click each card to expand">
        <ValueProposition />
      </Section>

      <Divider />

      <Section title="Imperative vs Declarative" subtitle="The core shift React introduced">
        <ImperativeVsDeclarative />
        <Note>jQuery required you to imperatively mutate the DOM step by step. React lets you declare the desired output — state changes flow to UI automatically.</Note>
      </Section>

      <Divider />

      <Section title="Flux Architecture Demo" subtitle="Action → Dispatcher → Store → View (this is useReducer's mental model)">
        <FluxDemo />
        <Note>
          Flux solved the "two-way data binding chaos" of frameworks like AngularJS 1.x.
          Redux is a Flux implementation. useReducer is React's built-in Flux primitive.
          The pattern: Actions are plain objects describing what happened. The reducer (store) decides how state changes.
        </Note>
        <Code>{`// Flux in one hook
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "INCREMENT" }); // Action
// reducer is your Store — pure function, no side effects`}</Code>
      </Section>
    </div>
  );
}

function btn(bg: string) {
  return { background: bg, border: "1px solid #333", color: "#fff", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 } as const;
}
