// Ch09 — React Server Components
// Covers: RSC benefits, rules, serializability, Server Actions, Forms/Mutations

import { useState } from "react";
import { Section, Code, Note, Divider, Badge } from "../../components/Lab";

function RSCVsSSRVsClient() {
  const approaches = [
    { label: "Client Component", badge: "CLIENT", color: "#7b8cde", js: "✓ Shipped", db: "✗ API call", hooks: "✓ Yes", interactive: "✓ Yes", example: `'use client'
function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n+1)}>{n}</button>;
}` },
    { label: "SSR Component", badge: "SSR", color: "#fbbf24", js: "✓ Shipped (for hydration)", db: "✓ Server-side", hooks: "✓ Yes", interactive: "✓ After hydration", example: `// getServerSideProps / loader
export async function getServerSideProps() {
  const data = await db.query();
  return { props: { data } };
}` },
    { label: "React Server Component", badge: "RSC", color: "#86efac", js: "✗ None shipped", db: "✓ Direct DB access", hooks: "✗ No useState/useEffect", interactive: "✗ Static only", example: `// Server Component (default in App Router)
async function UserProfile({ id }) {
  const user = await db.users.findById(id);
  // No useState, no useEffect
  // No JS shipped for this component!
  return <div>{user.name}</div>;
}` },
  ];

  const [selected, setSelected] = useState(2);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {approaches.map((a, i) => (
          <button key={i} onClick={() => setSelected(i)}
            style={{ background: selected === i ? a.color + "22" : "#1a1a2e", border: `1px solid ${selected === i ? a.color : "#2a2a4a"}`, color: selected === i ? a.color : "#888", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            {a.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
          <Badge color={approaches[selected].color}>{approaches[selected].badge}</Badge>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            {[["JS Bundle", approaches[selected].js], ["DB Access", approaches[selected].db], ["React Hooks", approaches[selected].hooks], ["Interactive", approaches[selected].interactive]].map(([label, val]) => (
              <div key={label} style={{ background: "#0d0d1a", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: val?.startsWith("✓") ? "#86efac" : "#f87171" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
        <Code>{approaches[selected].example}</Code>
      </div>
    </div>
  );
}

function RSCRules() {
  const rules = [
    {
      title: "Serializability Is King",
      color: "#f87171",
      desc: "Server Components can only pass serializable props to Client Components. Functions, Dates, Sets, Maps cannot cross the boundary — they can't be JSON-serialized.",
      bad: `// ❌ Can't pass a function as prop
<ClientComp onClick={handleClick} />

// ❌ Can't pass a class instance
<ClientComp user={new User()} />`,
      good: `// ✓ Pass serializable data
<ClientComp
  userId={user.id}
  userName={user.name}
/>
// Define onClick inside the Client Component`,
    },
    {
      title: "No Effectful Hooks",
      color: "#fbbf24",
      desc: "Server Components cannot use useState, useEffect, useContext, or any hook that requires a client runtime. They run once on the server — there's no browser to run effects in.",
      bad: `// ❌ No hooks in Server Components
async function ServerComp() {
  const [data, setData] = useState([]);
  useEffect(() => fetchData(), []);
}`,
      good: `// ✓ Async/await directly
async function ServerComp() {
  const data = await db.findAll();
  return <List items={data} />;
}`,
    },
    {
      title: "Client Components Cannot Import Server Components",
      color: "#a5f3fc",
      desc: "Client Components can receive Server Components as children (props) — but they cannot import them directly. Importing would pull server-only code into the client bundle.",
      bad: `// ❌ Client imports Server
'use client'
import ServerComp from './ServerComp';
function Client() {
  return <ServerComp />;
}`,
      good: `// ✓ Server wraps Client with children
// In a Server Component:
<ClientShell>
  <ServerContent />  {/* passed as children prop */}
</ClientShell>`,
    },
    {
      title: "State Is Not State",
      color: "#86efac",
      desc: "Server Components run on every request — they don't persist state between renders. What looks like 'state' is just the server re-running the component with new props/params.",
      bad: `// ❌ Misunderstanding: this 'state'
// doesn't persist between requests
let requestCount = 0; // module-level — DANGEROUS
async function ServerComp() {
  requestCount++; // shared across users!
}`,
      good: `// ✓ Use URL params for server 'state'
async function Page({ searchParams }) {
  const page = searchParams.page ?? 1;
  const data = await db.find({ page });
  return <List data={data} page={page} />;
}`,
    },
  ];

  const [selected, setSelected] = useState(0);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {rules.map((r, i) => (
          <button key={i} onClick={() => setSelected(i)}
            style={{ background: selected === i ? r.color + "22" : "#1a1a2e", border: `1px solid ${selected === i ? r.color : "#2a2a4a"}`, color: selected === i ? r.color : "#888", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            {r.title.split(" ").slice(0, 2).join(" ")}...
          </button>
        ))}
      </div>
      <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
        <h4 style={{ color: rules[selected].color, margin: "0 0 8px" }}>{rules[selected].title}</h4>
        <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{rules[selected].desc}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <p style={{ color: "#f87171", fontSize: 12, margin: "0 0 6px" }}>Don't</p>
            <Code>{rules[selected].bad}</Code>
          </div>
          <div>
            <p style={{ color: "#86efac", fontSize: 12, margin: "0 0 6px" }}>Do</p>
            <Code>{rules[selected].good}</Code>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServerActionsDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Server Action (runs on server, called from client):</p>
        <Code>{`// In a Server Component file:
'use server'

async function createPost(formData: FormData) {
  // This function runs on the SERVER
  // even when called from a Client Component
  const title = formData.get('title');
  await db.posts.create({ title });
  revalidatePath('/posts');
}

// In JSX:
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>

// No API endpoint needed!
// React serializes the call over the network`}</Code>
      </div>
      <div>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Simulated form (client-side demo):</p>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 16 }}>
          {!submitted ? (
            <>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Post title..."
                style={{ width: "100%", background: "#0d0d1a", border: "1px solid #2a2a4a", color: "#fff", padding: "8px 12px", borderRadius: 6, marginBottom: 10, boxSizing: "border-box" }}
              />
              <button
                onClick={() => name && setSubmitted(true)}
                style={{ background: "#7b8cde", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: "pointer", width: "100%" }}
              >
                Create Post (Server Action)
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
              <p style={{ color: "#86efac", margin: "0 0 12px" }}>Post "{name}" created!</p>
              <p style={{ color: "#888", fontSize: 12, margin: "0 0 12px" }}>In a real RSC app: ran on server, DB updated, cache revalidated.</p>
              <button onClick={() => { setSubmitted(false); setName(""); }} style={{ background: "#333", border: "1px solid #555", color: "#fff", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>Reset</button>
            </div>
          )}
        </div>
        <Note>
          Server Actions eliminate the need for separate API endpoints for mutations. The "use server"
          directive marks functions that run on the server — React handles the network call transparently.
        </Note>
      </div>
    </div>
  );
}

export default function Ch09() {
  return (
    <div>
      <h2 style={{ color: "#7b8cde", margin: "0 0 8px" }}>Chapter 9 — React Server Components</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>RSC is the biggest architectural shift since Hooks — components that run only on the server and ship zero JavaScript.</p>

      <Section title="Client vs SSR vs RSC" subtitle="What's actually different between rendering strategies">
        <RSCVsSSRVsClient />
        <Note>
          RSC is NOT SSR. SSR renders on the server then re-renders on the client (hydration). RSC components
          render only on the server and are never re-rendered on the client. Client Components still hydrate.
          A single app mixes both — RSC for data/layout, Client for interactivity.
        </Note>
      </Section>

      <Divider />

      <Section title="Rules of Server Components" subtitle="The constraints that make RSC work — click each rule">
        <RSCRules />
      </Section>

      <Divider />

      <Section title="Server Actions" subtitle="Mutations without API endpoints">
        <ServerActionsDemo />
      </Section>
    </div>
  );
}
