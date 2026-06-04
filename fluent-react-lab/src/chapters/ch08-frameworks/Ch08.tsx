// Ch08 — Frameworks
// Covers: Why frameworks, Next.js vs Remix trade-offs, choosing a framework

import { useState } from "react";
import { Section, Code, Note, Divider } from "../../components/Lab";

function WhyFrameworks() {
  const concerns = [
    { name: "Server Rendering", react: "You build it", framework: "Built-in", icon: "🖥️" },
    { name: "Routing", react: "React Router (manual)", framework: "File-based, automatic", icon: "🗺️" },
    { name: "Data Fetching", react: "useEffect / TanStack Query", framework: "Loaders / Server Components", icon: "📡" },
    { name: "Code Splitting", react: "Manual lazy()", framework: "Automatic per route", icon: "✂️" },
    { name: "Meta Tags / SEO", react: "react-helmet (manual)", framework: "Built-in metadata API", icon: "🔍" },
    { name: "API Routes", react: "Separate server needed", framework: "Collocated, same codebase", icon: "🔌" },
    { name: "Deployment", react: "Configure yourself", framework: "Optimized adapters", icon: "🚀" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 1, background: "#2a2a4a", borderRadius: 8, overflow: "hidden" }}>
        {["Feature", "Raw React", "Framework"].map((h) => (
          <div key={h} style={{ background: "#1a1a2e", padding: "10px 14px", fontSize: 12, color: "#888", fontWeight: 700 }}>{h}</div>
        ))}
        {concerns.map((c) => (
          <>
            <div key={c.name + "0"} style={{ background: "#0d0d1a", padding: "10px 14px", fontSize: 13, display: "flex", gap: 8 }}><span>{c.icon}</span>{c.name}</div>
            <div key={c.name + "1"} style={{ background: "#0d0d1a", padding: "10px 14px", fontSize: 12, color: "#f87171" }}>{c.react}</div>
            <div key={c.name + "2"} style={{ background: "#0d0d1a", padding: "10px 14px", fontSize: 12, color: "#86efac" }}>{c.framework}</div>
          </>
        ))}
      </div>
    </div>
  );
}

function FrameworkComparison() {
  const [selected, setSelected] = useState<"nextjs" | "remix">("nextjs");

  const frameworks = {
    nextjs: {
      name: "Next.js",
      tagline: "The React framework for the web",
      color: "#fff",
      strengths: [
        "App Router with React Server Components by default",
        "Largest ecosystem, most tutorials, best hiring pool",
        "Automatic image optimization (next/image)",
        "Edge and serverless deployment (Vercel-optimized)",
        "Static generation (SSG) + ISR (Incremental Static Regeneration)",
        "Turbopack for ultra-fast local dev builds",
      ],
      weaknesses: [
        "App Router complexity — Server vs Client boundaries are confusing",
        "Vercel lock-in perception (though self-hosting works)",
        "Rapid changes — docs sometimes lag behind features",
        "Larger opinionated surface area",
      ],
      bestFor: "Marketing sites, e-commerce, content-heavy apps, teams new to React",
      routing: `// File-based routing: app/posts/[id]/page.tsx
// = automatically /posts/123

// Data fetching in Server Component:
async function PostPage({ params }) {
  const post = await db.posts.findById(params.id);
  return <article>{post.content}</article>;
}`,
    },
    remix: {
      name: "Remix",
      tagline: "Focused on web fundamentals",
      color: "#e8d5b7",
      strengths: [
        "Progressive enhancement — works without JS",
        "Loaders + Actions colocated with routes (clean mental model)",
        "Web Platform first — fetch, FormData, Response — no proprietary APIs",
        "Nested routing + parallel data loading built-in",
        "Excellent error handling — nested error boundaries per route",
        "Now merged with React Router v7",
      ],
      weaknesses: [
        "Smaller ecosystem and community vs Next.js",
        "Less out-of-box tooling (image optimization, etc.)",
        "Fewer tutorials and job postings",
        "Shopify acquisition created some uncertainty",
      ],
      bestFor: "Forms-heavy apps, CRUD apps, teams that value web fundamentals",
      routing: `// File-based: routes/posts.$id.tsx
// = automatically /posts/123

// Loader + Action colocated:
export async function loader({ params }) {
  return await db.posts.findById(params.id);
}
export async function action({ request }) {
  const data = await request.formData();
  await db.posts.update(data);
  return redirect('/posts');
}`,
    },
  };

  const fw = frameworks[selected];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["nextjs", "remix"] as const).map((k) => (
          <button key={k} onClick={() => setSelected(k)}
            style={{ background: selected === k ? "#1a1a2e" : "transparent", border: `1px solid ${selected === k ? "#7b8cde" : "#2a2a4a"}`, color: selected === k ? "#fff" : "#888", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: selected === k ? 700 : 400 }}>
            {frameworks[k].name}
          </button>
        ))}
      </div>

      <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: fw.color, margin: "0 0 4px" }}>{fw.name}</h3>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 20px" }}>{fw.tagline}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <p style={{ color: "#86efac", fontSize: 12, fontWeight: 700, margin: "0 0 8px" }}>Strengths</p>
            {fw.strengths.map((s) => <div key={s} style={{ fontSize: 13, color: "#aaa", marginBottom: 6, display: "flex", gap: 8 }}><span style={{ color: "#86efac" }}>✓</span>{s}</div>)}
          </div>
          <div>
            <p style={{ color: "#f87171", fontSize: 12, fontWeight: 700, margin: "0 0 8px" }}>Trade-offs</p>
            {fw.weaknesses.map((w) => <div key={w} style={{ fontSize: 13, color: "#aaa", marginBottom: 6, display: "flex", gap: 8 }}><span style={{ color: "#f87171" }}>△</span>{w}</div>)}
          </div>
        </div>

        <div style={{ background: "#0d0d1a", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#888" }}>Best for: </span>
          <span style={{ fontSize: 13, color: "#fbbf24" }}>{fw.bestFor}</span>
        </div>

        <Code>{fw.routing}</Code>
      </div>
    </div>
  );
}

function DecisionMatrix() {
  const questions = [
    { q: "Do you need SEO?", next: { yes: "SSR needed → Next.js or Remix", no: "SPA is fine → Vite + React Router" } },
    { q: "Is it forms/CRUD heavy?", next: { yes: "Remix shines here", no: "Next.js is more general" } },
    { q: "Large team, lots of content?", next: { yes: "Next.js — bigger ecosystem", no: "Remix — simpler mental model" } },
    { q: "Need edge deployment?", next: { yes: "Next.js (Vercel) or Remix (Cloudflare)", no: "Either works" } },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {questions.map((item, i) => (
        <div key={i} style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
          <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Q{i + 1}: {item.q}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ background: "#1e3a1e", border: "1px solid #2a4a2a", borderRadius: 6, padding: "8px 14px", fontSize: 13, flex: 1 }}>
              <span style={{ color: "#86efac" }}>Yes → </span>{item.next.yes}
            </div>
            <div style={{ background: "#3a1e1e", border: "1px solid #4a2a2a", borderRadius: 6, padding: "8px 14px", fontSize: 13, flex: 1 }}>
              <span style={{ color: "#f87171" }}>No → </span>{item.next.no}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Ch08() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 8 — Frameworks</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>Why raw React isn't enough for production, and how to choose between Next.js and Remix.</p>

      <Section title="What Frameworks Solve" subtitle="The gap between raw React and production apps">
        <WhyFrameworks />
        <Note>
          React is a UI library, not a framework. It solves rendering but leaves routing, data fetching,
          SSR, and deployment as exercise for the developer. Frameworks fill these gaps with opinionated,
          integrated solutions that compose better than assembling your own stack.
        </Note>
      </Section>

      <Divider />

      <Section title="Next.js vs Remix" subtitle="The two dominant React frameworks in 2024–2026">
        <FrameworkComparison />
      </Section>

      <Divider />

      <Section title="How to Choose" subtitle="Decision criteria from the book">
        <DecisionMatrix />
        <Note>
          The book's conclusion: pick Next.js if you're uncertain — it has the largest ecosystem and you'll
          never be blocked for lack of a library. Pick Remix if your app is form/mutation-heavy and you want
          to embrace web fundamentals (progressive enhancement, FormData, redirects).
        </Note>
      </Section>
    </div>
  );
}
