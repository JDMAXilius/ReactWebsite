// Ch07 — Concurrent React
// Covers: Synchronous vs Concurrent rendering, Scheduler, Render Lanes,
//         useTransition, useDeferredValue, Tearing problem

import { useState, useTransition, useDeferredValue, useMemo } from "react";
import { Section, Code, Note, Divider, Badge } from "../../components/Lab";

// ── Synchronous rendering problem demo ────────────────────────────────────
function SyncProblemDemo() {
  const [mode, setMode] = useState<"sync" | "concurrent">("sync");
  const [input, setInput] = useState("");
  useTransition(); // available for future enhancement

  const items = useMemo(() => {
    // Simulate expensive computation
    if (!input) return [];
    const result: string[] = [];
    for (let i = 0; i < 5000; i++) {
      if (`item-${i}`.includes(input)) result.push(`item-${i}`);
    }
    return result.slice(0, 50);
  }, [input]);

  const [deferredInput, setDeferredInput] = useState("");
  const deferredQuery = useDeferredValue(deferredInput);
  const deferredItems = useMemo(() => {
    if (!deferredQuery) return [];
    const result: string[] = [];
    for (let i = 0; i < 5000; i++) {
      if (`item-${i}`.includes(deferredQuery)) result.push(`item-${i}`);
    }
    return result.slice(0, 50);
  }, [deferredQuery]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("sync")} style={{ background: mode === "sync" ? "#f87171" + "22" : "#1a1a2e", border: `1px solid ${mode === "sync" ? "#f87171" : "#2a2a4a"}`, color: mode === "sync" ? "#f87171" : "#888", padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>Synchronous (blocks UI)</button>
        <button onClick={() => setMode("concurrent")} style={{ background: mode === "concurrent" ? "#86efac" + "22" : "#1a1a2e", border: `1px solid ${mode === "concurrent" ? "#86efac" : "#2a2a4a"}`, color: mode === "concurrent" ? "#86efac" : "#888", padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>Concurrent (keeps UI responsive)</button>
      </div>

      {mode === "sync" ? (
        <div>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Type fast — notice the input lag as filtering 5000 items blocks rendering:</p>
          <input
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Type to filter items (feel the lag)..."
            style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2a2a4a", color: "#fff", padding: "8px 12px", borderRadius: 6, marginBottom: 12, boxSizing: "border-box" }}
          />
          <div style={{ maxHeight: 120, overflowY: "auto", fontSize: 12, color: "#aaa" }}>
            {items.map((item) => <div key={item}>{item}</div>)}
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>useDeferredValue — input stays responsive, list update is deferred:</p>
          <input
            value={deferredInput} onChange={(e) => setDeferredInput(e.target.value)}
            placeholder="Type to filter items (stays responsive)..."
            style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2a2a4a", color: "#fff", padding: "8px 12px", borderRadius: 6, marginBottom: 12, boxSizing: "border-box" }}
          />
          <div style={{ maxHeight: 120, overflowY: "auto", fontSize: 12, color: deferredInput !== deferredQuery ? "#555" : "#aaa" }}>
            {deferredItems.map((item) => <div key={item}>{item}</div>)}
          </div>
          {deferredInput !== deferredQuery && <p style={{ color: "#fbbf24", fontSize: 12 }}>⏳ Updating list...</p>}
        </div>
      )}
    </div>
  );
}

// ── useTransition Demo ────────────────────────────────────────────────────
const tabs = ["Home", "Posts", "Settings"];

function SlowComponent({ tab }: { tab: string }) {
  // Simulate slow render
  const start = performance.now();
  while (performance.now() - start < 50) {} // artificial 50ms delay
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 20 }}>
      <h3 style={{ margin: "0 0 8px", color: "#7b8cde" }}>{tab}</h3>
      <p style={{ margin: 0, color: "#aaa", fontSize: 13 }}>
        This panel simulates a slow render (50ms delay). With useTransition, switching tabs
        doesn't block your clicks — React keeps processing the old tab while preparing the new one.
      </p>
    </div>
  );
}

function TransitionDemo() {
  const [activeTab, setActiveTab] = useState("Home");
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"normal" | "transition">("normal");

  function switchTab(tab: string) {
    if (mode === "transition") {
      startTransition(() => setActiveTab(tab));
    } else {
      setActiveTab(tab);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setMode("normal")} style={{ background: mode === "normal" ? "#f87171" + "22" : "#1a1a2e", border: `1px solid ${mode === "normal" ? "#f87171" : "#2a2a4a"}`, color: mode === "normal" ? "#f87171" : "#888", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Without useTransition</button>
        <button onClick={() => setMode("transition")} style={{ background: mode === "transition" ? "#86efac" + "22" : "#1a1a2e", border: `1px solid ${mode === "transition" ? "#86efac" : "#2a2a4a"}`, color: mode === "transition" ? "#86efac" : "#888", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>With useTransition</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => switchTab(tab)}
            style={{ background: activeTab === tab ? "#7b8cde" : "#1a1a2e", border: "1px solid #2a2a4a", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", opacity: isPending ? 0.7 : 1 }}>
            {tab} {isPending && activeTab !== tab ? "..." : ""}
          </button>
        ))}
        {isPending && <Badge color="#fbbf24">Rendering...</Badge>}
      </div>
      <SlowComponent tab={activeTab} />
      <Code>{`const [isPending, startTransition] = useTransition();

function switchTab(tab) {
  startTransition(() => {
    setActiveTab(tab); // marked as non-urgent
  });
}
// React keeps current tab visible while
// preparing the next one in background.
// isPending = true during transition.`}</Code>
    </div>
  );
}

// ── Render Lanes visualization ────────────────────────────────────────────
function LanesVisualization() {
  const lanes = [
    { name: "SyncLane", priority: "Highest", color: "#f87171", bits: "0b0000000000000000000000000000001", example: "ReactDOM.flushSync()" },
    { name: "InputContinuousLane", priority: "High", color: "#fbbf24", bits: "0b0000000000000000000000000000100", example: "Input events, mouse moves" },
    { name: "DefaultLane", priority: "Normal", color: "#7b8cde", bits: "0b0000000000000000000000000010000", example: "setState in event handlers" },
    { name: "TransitionLane", priority: "Low", color: "#86efac", bits: "0b0000000000000000000000010000000", example: "startTransition()" },
    { name: "IdleLane", priority: "Idle", color: "#555", bits: "0b0100000000000000000000000000000", example: "Offscreen rendering" },
  ];

  return (
    <div>
      {lanes.map((lane) => (
        <div key={lane.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, padding: "10px 14px", background: "#1a1a2e", borderRadius: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: lane.color, flexShrink: 0 }} />
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: lane.color }}>{lane.name}</div>
            <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{lane.bits}</div>
          </div>
          <Badge color={lane.color}>{lane.priority}</Badge>
          <div style={{ fontSize: 12, color: "#888", marginLeft: "auto" }}>{lane.example}</div>
        </div>
      ))}
      <Code>{`// Lanes are bitmasks — React can combine
// multiple lanes with bitwise OR:
const workInProgressLanes = SyncLane | DefaultLane;

// And check inclusion with AND:
if (workInProgressLanes & TransitionLane) {
  // this work includes a transition
}`}</Code>
    </div>
  );
}

export default function Ch07() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 7 — Concurrent React</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>Concurrent mode makes rendering interruptible. React can pause, abort, or restart renders based on priority.</p>

      <Section title="The Problem: Synchronous Rendering Blocks UI" subtitle="Try both modes — notice input responsiveness difference">
        <SyncProblemDemo />
        <Note>
          Synchronous rendering in the Stack Reconciler was all-or-nothing. If rendering a component tree
          took 300ms, the browser couldn't process any user input for 300ms. Fiber's interruptible work
          loop solves this — React yields to the browser between fiber units.
        </Note>
      </Section>

      <Divider />

      <Section title="useTransition — Non-Urgent Updates" subtitle="Mark state updates as low priority — React keeps UI responsive">
        <TransitionDemo />
        <Note>
          useTransition is the API surface for Concurrent React. startTransition tells React: "this update
          is not urgent — keep the current UI responsive while preparing the next state."
          React can then interrupt the transition render if a more urgent update (like typing) comes in.
        </Note>
      </Section>

      <Divider />

      <Section title="Render Lanes — Priority Bitmask System" subtitle="How React prioritizes work internally">
        <LanesVisualization />
        <Note>
          Lanes replaced the old "expiration times" model in React 18. They're bitmasks, so React can batch
          multiple priorities together efficiently. startTransition() moves work to a low-priority TransitionLane.
          Urgent updates (clicks, input) run in SyncLane — they can interrupt transitions.
        </Note>
      </Section>
    </div>
  );
}
