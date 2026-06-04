// Ch04 — Inside Reconciliation
// Covers: Stack Reconciler (legacy), Fiber as a data structure, batching, double buffering

import { useState, useRef } from "react";
import { Section, Code, Note, Divider } from "../../components/Lab";

// ── Batching Demo ─────────────────────────────────────────────────────────
function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const renderCount = useRef(0);
  renderCount.current++;

  function handleUnbatched() {
    // In React 17 and event handlers, React auto-batches
    // This shows the conceptual difference
    setCount((c) => c + 1);
    setFlag((f) => !f);
    // Result: 1 render (both updates batched together)
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
          <p style={{ margin: "0 0 8px", color: "#888", fontSize: 13 }}>Component renders: <strong style={{ color: "#7b8cde" }}>{renderCount.current}</strong></p>
          <p style={{ margin: "0 0 4px", fontSize: 14 }}>count: <strong>{count}</strong></p>
          <p style={{ margin: "0 0 12px", fontSize: 14 }}>flag: <strong>{String(flag)}</strong></p>
          <button
            onClick={handleUnbatched}
            style={{ background: "#7b8cde", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}
          >
            Two setState calls (1 render)
          </button>
        </div>
        <div>
          <Code>{`// React 18 automatic batching
// Even in setTimeout, fetch, etc:
function handleClick() {
  setCount(c => c + 1); // no render yet
  setFlag(f => !f);     // no render yet
}                        // → ONE render here

// Before React 18: only event handlers
// were batched. setTimeout was NOT:
setTimeout(() => {
  setCount(c => c + 1); // render!
  setFlag(f => !f);     // render!  ← 2 renders
}, 0);

// React 18 batches ALL of these!`}</Code>
        </div>
      </div>
      <Note>
        React 18 introduced "automatic batching" — all state updates, even those in setTimeout,
        Promises, and native event handlers, are now batched into a single render.
        Use flushSync() from react-dom to opt out when you need an immediate DOM update.
      </Note>
    </div>
  );
}

// ── Fiber Node visualizer ─────────────────────────────────────────────────
function FiberVisualizer() {
  const [selected, setSelected] = useState<string | null>(null);

  const fiberNode = {
    tag: "FunctionComponent",
    type: "Button",
    stateNode: "DOM node (button)",
    return: "→ parent Fiber (Form)",
    child: "→ first child Fiber (span)",
    sibling: "→ next sibling Fiber (Input)",
    pendingProps: { label: "Submit", disabled: false },
    memoizedState: { queue: "useState hook linked list" },
    flags: "Update | Ref",
    lanes: "0b0000000000000000000000000000001",
  };

  const highlighted = selected ? { [selected]: true } : {};

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>A Fiber is a JavaScript object — one per component instance:</p>
        <div style={{ background: "#0d0d1a", borderRadius: 8, padding: 16, fontFamily: "monospace", fontSize: 12 }}>
          <div style={{ color: "#888", marginBottom: 8 }}>{"FiberNode {"}</div>
          {Object.entries(fiberNode).map(([k, v]) => (
            <div
              key={k}
              onClick={() => setSelected(selected === k ? null : k)}
              style={{ padding: "4px 8px", borderRadius: 4, cursor: "pointer", marginBottom: 2, background: highlighted[k] ? "#1a2a4a" : "transparent", display: "flex", gap: 8 }}
            >
              <span style={{ color: "#7b8cde", minWidth: 120 }}>{k}:</span>
              <span style={{ color: "#a5f3fc" }}>{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
            </div>
          ))}
          <div style={{ color: "#888" }}>{"}"}</div>
        </div>
      </div>
      <div>
        {selected ? (
          <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
            <p style={{ color: "#7b8cde", fontWeight: 700, marginBottom: 8 }}>{selected}</p>
            {{
              tag: "Identifies the type of fiber: FunctionComponent (0), ClassComponent (1), HostRoot (3), HostComponent (5, DOM elements), etc.",
              type: "The function or class that created this component. Used for reconciliation identity.",
              stateNode: "Reference to the actual DOM node (for host components) or class instance.",
              return: "Pointer to parent fiber. Enables React to 'walk up' the tree after processing children.",
              child: "Pointer to first child fiber. The tree is a linked list, not an array.",
              sibling: "Pointer to next sibling. Together with child/return, forms a linked-list tree.",
              pendingProps: "Props the fiber will be rendered with in the next work cycle.",
              memoizedState: "Linked list of hook states. Each useState/useEffect creates a node in this list.",
              flags: "Bitmask of effects to perform (Placement, Update, Deletion, Ref, Snapshot, etc.).",
              lanes: "Priority bitmask. Which update 'lane' this fiber belongs to (concurrent feature).",
            }[selected] ? (
              <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6 }}>
                {{
                  tag: "Identifies the type of fiber: FunctionComponent (0), ClassComponent (1), HostRoot (3), HostComponent (5, DOM elements), etc.",
                  type: "The function or class that created this component. Used for reconciliation identity.",
                  stateNode: "Reference to the actual DOM node (for host components) or class instance.",
                  return: "Pointer to parent fiber. Enables React to 'walk up' the tree after processing children.",
                  child: "Pointer to first child fiber. The tree is a linked list, not an array.",
                  sibling: "Pointer to next sibling. Together with child/return, forms a linked-list tree.",
                  pendingProps: "Props the fiber will be rendered with in the next work cycle.",
                  memoizedState: "Linked list of hook states. Each useState/useEffect creates a node in this list.",
                  flags: "Bitmask of effects to perform (Placement, Update, Deletion, Ref, Snapshot, etc.).",
                  lanes: "Priority bitmask. Which update 'lane' this fiber belongs to (concurrent feature).",
                }[selected]}
              </p>
            ) : null}
          </div>
        ) : (
          <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16, color: "#555", fontSize: 13 }}>
            ← Click a field to see what it does
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <Code>{`// The key insight: Fiber is a linked list
// not a recursive call stack!
// This makes rendering interruptible.

// Stack Reconciler (legacy, React < 16):
// Used recursive calls — couldn't pause
// halfway through rendering a deep tree.

// Fiber Reconciler (React 16+):
// Uses a work loop with a linked list.
// Can pause after each fiber, yield to
// the browser, then resume. This is how
// concurrent mode works.`}</Code>
        </div>
      </div>
    </div>
  );
}

// ── Double Buffering ──────────────────────────────────────────────────────
function DoubleBufferingDemo() {
  const [phase, setPhase] = useState<"idle" | "render" | "commit">("idle");
  const [version, setVersion] = useState(0);

  async function simulateUpdate() {
    setPhase("render");
    await new Promise((r) => setTimeout(r, 800));
    setPhase("commit");
    await new Promise((r) => setTimeout(r, 400));
    setVersion((v) => v + 1);
    setPhase("idle");
  }

  const colors: Record<string, string> = { idle: "#555", render: "#fbbf24", commit: "#86efac" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {["current", "workInProgress", "dom"].map((tree) => (
          <div key={tree} style={{ background: "#1a1a2e", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
              {tree === "current" ? "Current Tree" : tree === "workInProgress" ? "Work-In-Progress Tree" : "Real DOM"}
            </div>
            <div style={{ fontSize: 20, marginBottom: 8 }}>
              {tree === "current" ? "🌲" : tree === "workInProgress" ? "🌱" : "🖥️"}
            </div>
            <div style={{ fontSize: 12, color: colors[phase] }}>
              {tree === "current" && (phase === "idle" ? `v${version} (visible)` : `v${version} (paused)`)}
              {tree === "workInProgress" && (phase === "render" ? `v${version + 1} (building...)` : phase === "commit" ? `v${version + 1} (ready)` : "—")}
              {tree === "dom" && (phase === "commit" ? `updating → v${version + 1}` : `v${version}`)}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={simulateUpdate}
        disabled={phase !== "idle"}
        style={{ background: phase === "idle" ? "#7b8cde" : "#333", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: phase === "idle" ? "pointer" : "default" }}
      >
        {phase === "idle" ? "Trigger Update" : phase === "render" ? "Rendering WIP tree..." : "Committing to DOM..."}
      </button>
      <Note>
        React always has TWO fiber trees: the "current" tree (what's on screen) and the "work-in-progress" tree
        (what React is building). This is double buffering — like how GPUs render to an off-screen buffer then flip.
        When the WIP tree is complete, React swaps them (the commit phase) in one synchronous operation.
      </Note>
    </div>
  );
}

export default function Ch04() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 4 — Inside Reconciliation</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>Fiber is React's reimplementation of the reconciler as an interruptible linked-list work loop.</p>

      <Section title="Automatic Batching" subtitle="Multiple setState calls → one render">
        <BatchingDemo />
      </Section>

      <Divider />

      <Section
        title="Fiber: The Work Unit"
        subtitle="Every component instance has a corresponding Fiber node — click fields to explore"
      >
        <FiberVisualizer />
        <Note>
          The Stack Reconciler (React &lt; 16) used JavaScript's call stack, making rendering non-interruptible.
          If a deep component tree took 200ms to render, the browser would freeze for 200ms.
          Fiber solves this by converting recursion into an explicit linked-list loop that can be paused.
        </Note>
      </Section>

      <Divider />

      <Section title="Double Buffering" subtitle="Two trees: current (on-screen) + work-in-progress (being built)">
        <DoubleBufferingDemo />
        <Code>{`// Fiber reconciliation phases:
// 1. RENDER PHASE (interruptible, async-safe)
//    - Create WIP fiber tree
//    - Diff with current tree
//    - Mark fibers with effect flags
//    - Can be paused, aborted, restarted

// 2. COMMIT PHASE (synchronous, uninterruptible)
//    - Apply all DOM mutations at once
//    - Run useLayoutEffect, ref updates
//    - Can never be interrupted

// After commit: WIP becomes "current" tree`}</Code>
      </Section>
    </div>
  );
}
