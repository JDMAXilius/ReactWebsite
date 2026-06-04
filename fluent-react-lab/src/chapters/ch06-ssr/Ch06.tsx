// Ch06 — Server-Side React
// Covers: CSR limitations, SSR benefits, Hydration, renderToString vs Streaming

import { useState } from "react";
import { Section, Code, Note, Divider, Badge } from "../../components/Lab";

function RenderingModels() {
  const [selected, setSelected] = useState<"csr" | "ssr" | "streaming">("csr");

  const models = {
    csr: {
      label: "Client-Side Rendering (CSR)",
      color: "#f87171",
      timeline: [
        { step: "Request HTML", ms: 0, note: "Browser gets empty shell" },
        { step: "Download JS bundle", ms: 300, note: "Could be 500KB+ for large apps" },
        { step: "Parse & execute JS", ms: 600, note: "CPU-bound — blocks main thread" },
        { step: "Fetch data", ms: 900, note: "API call from the client" },
        { step: "Render content", ms: 1200, note: "First Contentful Paint" },
      ],
      problems: ["Poor SEO (crawlers see empty HTML)", "Slow First Contentful Paint", "Sensitive API calls exposed to client", "No content without JS"],
    },
    ssr: {
      label: "Server-Side Rendering (SSR)",
      color: "#fbbf24",
      timeline: [
        { step: "Request HTML", ms: 0, note: "Server starts rendering" },
        { step: "Server fetches data + renders", ms: 200, note: "All on server — parallel possible" },
        { step: "Browser receives full HTML", ms: 400, note: "First Contentful Paint — fast!" },
        { step: "Download JS bundle", ms: 700, note: "Hydration JS" },
        { step: "Hydrate (attach events)", ms: 900, note: "Page becomes interactive (TTI)" },
      ],
      problems: ["Hydration cost — page looks ready but isn't", "Full page re-render on navigation (without SPA routing)", "Server load for every request"],
    },
    streaming: {
      label: "Streaming SSR (React 18+)",
      color: "#86efac",
      timeline: [
        { step: "Request HTML", ms: 0, note: "Server starts streaming immediately" },
        { step: "Shell HTML arrives", ms: 100, note: "Layout, navigation render first" },
        { step: "Partial hydration begins", ms: 200, note: "Shell is interactive" },
        { step: "Content chunks stream in", ms: 400, note: "Suspense boundaries fill progressively" },
        { step: "Fully interactive", ms: 600, note: "All chunks hydrated" },
      ],
      problems: ["Requires Suspense boundaries", "Complex to implement without a framework", "TTFB optimization needed"],
    },
  };

  const model = models[selected];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(Object.keys(models) as Array<keyof typeof models>).map((k) => (
          <button key={k} onClick={() => setSelected(k)}
            style={{ background: selected === k ? models[k].color + "22" : "#1a1a2e", border: `1px solid ${selected === k ? models[k].color : "#2a2a4a"}`, color: selected === k ? models[k].color : "#888", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            {models[k].label.split(" ").slice(-1)[0] === "(CSR)" ? "CSR" : models[k].label.includes("Streaming") ? "Streaming" : "SSR"}
          </button>
        ))}
      </div>

      <h4 style={{ color: model.color, margin: "0 0 16px" }}>{model.label}</h4>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>Timeline</p>
          {model.timeline.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ minWidth: 48, fontSize: 11, color: model.color, fontFamily: "monospace", paddingTop: 2 }}>{t.ms}ms</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.step}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{t.note}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>Trade-offs</p>
          {model.problems.map((p) => (
            <div key={p} style={{ fontSize: 13, color: "#f87171", marginBottom: 8, display: "flex", gap: 8 }}>
              <span>⚠</span><span>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HydrationDemo() {
  const [hydrated, setHydrated] = useState(false);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
          <Badge color="#fbbf24">{hydrated ? "HYDRATED" : "PRE-HYDRATION"}</Badge>
          <p style={{ margin: "12px 0 8px", fontSize: 14 }}>Like this Counter:</p>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Count: 0</div>
          <button
            onClick={hydrated ? () => {} : undefined}
            style={{ background: hydrated ? "#7b8cde" : "#555", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: hydrated ? "pointer" : "not-allowed" }}
          >
            {hydrated ? "Click me! (works)" : "Click me (no-op — not hydrated)"}
          </button>
          {!hydrated && <p style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>Page LOOKS interactive but events aren't attached yet</p>}
        </div>
        <div>
          <Code>{`// Server renders HTML string:
const html = renderToString(<Counter />);
// Browser gets: <div>Count: 0</div>
// + <button>Click me</button>
// Content visible IMMEDIATELY ✓

// Then browser downloads React JS...
// hydrateRoot(document, <Counter />);
// React "adopts" the existing DOM nodes
// and attaches event listeners
// Now buttons actually work ✓

// The gap between paint and interactive
// is the "hydration uncanny valley"`}</Code>
          <button
            onClick={() => setHydrated((h) => !h)}
            style={{ marginTop: 12, background: "#2d5a27", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
          >
            Simulate hydration {hydrated ? "(reset)" : "(complete)"}
          </button>
        </div>
      </div>
      <Note>
        "Hydration Considered Harmful" (from the book): hydration forces React to re-render the entire tree client-side
        just to attach event listeners — work that was already done on the server. This is why React 18 introduced
        selective/partial hydration with Suspense, and why RSC aims to eliminate hydration for server components entirely.
      </Note>
    </div>
  );
}

function ServerApis() {
  const apis = [
    { name: "renderToString()", color: "#f87171", use: "Legacy SSR", desc: "Renders synchronously to a string. Blocks until entire tree is rendered. Simple but no streaming — TTFB is slow for large pages.", code: `const html = renderToString(<App />);
res.send(\`<html><body>\${html}</body></html>\`);` },
    { name: "renderToPipeableStream()", color: "#86efac", use: "Node.js Streaming (recommended)", desc: "Streams HTML progressively. Suspense boundaries flush as data resolves. Shell renders immediately, content fills in. Best for Node.js servers.", code: `const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    res.setHeader('Content-type', 'text/html');
    pipe(res); // streams HTML chunks
  }
});` },
    { name: "renderToReadableStream()", color: "#a5f3fc", use: "Edge / Web Streams", desc: "Same as Pipeable but returns a Web Streams API ReadableStream. Use with Cloudflare Workers, Deno, Bun.", code: `const stream = await renderToReadableStream(<App />);
return new Response(stream, {
  headers: { 'Content-Type': 'text/html' }
});` },
  ];

  const [selected, setSelected] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {apis.map((a, i) => (
          <button key={i} onClick={() => setSelected(i)}
            style={{ background: selected === i ? a.color + "22" : "#1a1a2e", border: `1px solid ${selected === i ? a.color : "#2a2a4a"}`, color: selected === i ? a.color : "#888", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            {a.name}
          </button>
        ))}
      </div>
      <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <Badge color={apis[selected].color}>{apis[selected].use}</Badge>
        </div>
        <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{apis[selected].desc}</p>
        <Code>{apis[selected].code}</Code>
      </div>
    </div>
  );
}

export default function Ch06() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 6 — Server-Side React</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>CSR vs SSR vs Streaming — trade-offs, hydration costs, and React's server rendering APIs.</p>

      <Section title="Rendering Models Compared" subtitle="CSR, SSR, and Streaming SSR — select to explore timeline & trade-offs">
        <RenderingModels />
      </Section>

      <Divider />

      <Section title="Hydration — The Uncanny Valley" subtitle="Why the page looks ready but isn't">
        <HydrationDemo />
      </Section>

      <Divider />

      <Section title="React Server Rendering APIs" subtitle="renderToString → renderToPipeableStream → renderToReadableStream">
        <ServerApis />
        <Note>
          The book's advice: "Don't Roll Your Own" SSR. Use Next.js or Remix — they handle the streaming,
          hydration, routing, and data fetching integration. Only implement custom SSR if you have a very
          specific reason and understand the pitfalls deeply.
        </Note>
      </Section>
    </div>
  );
}
