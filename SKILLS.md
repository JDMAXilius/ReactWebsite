# React Skills — Fluent React Study Guide

> All concepts covered in this session, mapped to *Fluent React* by Tejas Kumar (O'Reilly) and implemented in the **Nexus Dashboard** project.

---

## Ch01 — Entry-Level React

### Declarative vs Imperative
- React describes **what** the UI should look like; the framework figures out **how**
- Imperative: manual DOM manipulation (`getElementById`, `appendChild`)
- Declarative: JSX + state → React handles reconciliation

### Flux Pattern (useReducer)
```tsx
type Action = { type: "INCREMENT" } | { type: "SET"; payload: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT": return state + 1;
    case "SET": return action.payload;
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, 0);
dispatch({ type: "INCREMENT" });
```
- Predictable state transitions via pure functions
- Unidirectional data flow: Action → Reducer → State → UI → Action

---

## Ch02 — JSX

### JSX → createElement
```tsx
// What you write:
const el = <Button variant="primary">Click me</Button>;

// What Babel compiles it to:
const el = React.createElement(Button, { variant: "primary" }, "Click me");
```

### JSX Rules
- One root element (or `<>` Fragment)
- `className` not `class`, `htmlFor` not `for`
- Expressions in `{ }`, not statements
- Self-closing tags must close: `<img />`
- Components must start with uppercase

---

## Ch03 — The Virtual DOM

### React Element vs DOM Node
```tsx
// React Element — plain JS object, cheap to create
const element = { type: "div", props: { className: "box" }, children: [...] };

// Real DOM Node — expensive, has hundreds of properties
document.createElement("div"); // ~700 properties
```

### Reconciliation Keys
```tsx
// Without key — React re-creates all nodes on reorder
{items.map(item => <Item>{item}</Item>)}

// With key — React identifies and reuses existing nodes
{items.map(item => <Item key={item.id}>{item}</Item>)}
```

---

## Ch04 — Reconciliation & Fiber

### Fiber Architecture
- Fiber = linked-list work unit (one per React element)
- **Double buffering**: `current` tree (on screen) + `work-in-progress` tree (being built)
- React can pause, resume, and prioritize work between frames
- Render Lanes: bitmask priority system (`SyncLane`, `InputContinuousLane`, `DefaultLane`, `TransitionLane`)

### Error Boundary (must be a class component)
```tsx
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error }; // triggers re-render with error UI
  }

  render() {
    if (this.state.error) return <ErrorUI error={this.state.error} />;
    return this.props.children;
  }
}
```

---

## Ch05 — Patterns

### React.memo
```tsx
// Skips re-render if props haven't changed (shallow comparison)
const Avatar = memo(function Avatar({ initials, size }: Props) {
  return <div ...>{initials}</div>;
});
```

### Higher-Order Component (HOC)
```tsx
function withRoleBadge<P extends { member: TeamMember }>(
  WrappedComponent: React.ComponentType<P>
) {
  return function Enhanced(props: P) {
    return (
      <div>
        <WrappedComponent {...props} />
        <Badge>{props.member.role}</Badge>
      </div>
    );
  };
}

const EnhancedMember = withRoleBadge(MemberBase);
```

### Render Props
```tsx
function TeamStats({
  render,
}: {
  render: (stats: { total: number; online: number }) => ReactNode;
}) {
  const stats = { total: TEAM.length, online: TEAM.filter(m => m.status === "online").length };
  return <>{render(stats)}</>;
}

// Usage
<TeamStats render={stats => <div>{stats.total} members</div>} />
```

### Compound Components
```tsx
// Card is the "owner", Card.Header/Body/Footer share context
const Card = ({ children }) => <div className="card">{children}</div>;
Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body   = ({ children }) => <div className="card-body">{children}</div>;
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### Lazy Loading + Suspense
```tsx
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects  = lazy(() => import("./pages/Projects"));

<Suspense fallback={<PageLoader />}>
  <Dashboard />
</Suspense>
```

### React Portal (createPortal)
```tsx
import { createPortal } from "react-dom";

// Renders outside the main React tree — useful for modals, toasts, tooltips
function Toast({ message }: { message: string }) {
  return createPortal(
    <div className="toast">{message}</div>,
    document.body   // mounts here, not in the component's DOM position
  );
}
```
**Used for:** Toast notifications, Command Palette, Notifications panel.

### ref-as-prop (React 19)
```tsx
// React 18 — required forwardRef wrapper
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input ref={ref} {...props} />
));

// React 19 — ref is just a regular prop, no wrapper needed
function Input({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

---

## Ch06 — Server-Side Rendering

### Rendering Strategies Compared
| Strategy | Function | When rendered | JS shipped |
|---|---|---|---|
| CSR | (browser) | Client | Full bundle |
| SSR | `renderToString` | Server, blocks | Full bundle |
| Streaming | `renderToPipeableStream` | Server, progressive | Full bundle |
| RSC | (server only) | Server | Zero |

### Hydration
```tsx
// Server renders HTML string
const html = renderToString(<App />);

// Client "hydrates" — attaches event listeners to the existing HTML
// without re-creating DOM nodes
hydrateRoot(document.getElementById("root"), <App />);
```

---

## Ch07 — Concurrent React

### useTransition
```tsx
const [isPending, startTransition] = useTransition();

// Mark a state update as non-urgent — React can interrupt it
startTransition(() => {
  navigate("projects"); // won't block input/typing
});

// Show loading state while transition is in progress
{isPending && <Spinner />}
```

### useDeferredValue
```tsx
// useSearch.ts — keeps input responsive with large filtered lists
function useSearch<T>(items: T[], keys: (keyof T)[]) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query); // lags behind query intentionally
  const isStale = query !== deferred;       // true while filtering is in progress

  const results = useMemo(() =>
    items.filter(item =>
      keys.some(k => String(item[k]).toLowerCase().includes(deferred.toLowerCase()))
    ),
    [items, keys, deferred]
  );

  return { query, setQuery, results, isStale };
}
```

---

## Ch08 — Frameworks

### Next.js vs Remix
| Feature | Next.js | Remix |
|---|---|---|
| Routing | File-based (`app/`) | File-based (`routes/`) |
| Data fetching | `async` Server Components | `loader` functions |
| Mutations | Server Actions | `action` functions |
| Caching | Aggressive (ISR, full-route) | Minimal, manual |
| Best for | Content-heavy, SEO, large apps | Form-heavy, real-time apps |

---

## Ch09 — React Server Components

### RSC Rules
1. **Zero JS shipped** to the client — RSC never appears in the bundle
2. **No hooks** — `useState`, `useEffect`, etc. are client-only
3. **No browser APIs** — no `window`, `document`, `localStorage`
4. **Serializable props only** — no functions, no class instances across the boundary

### Server Actions
```tsx
// app/actions.ts  — runs on the server
"use server";
async function createProject(formData: FormData) {
  const name = formData.get("name");
  await db.projects.create({ name });
  revalidatePath("/projects");
}

// app/page.tsx — form calls server action directly
<form action={createProject}>
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

---

## React 19 — New Hooks

### use()
```tsx
import { use, Suspense } from "react";

// Promise cached outside component — re-creating inside would cause infinite suspense
const metricsPromise = fetch("/api/metrics").then(r => r.json());

function Metrics() {
  const data = use(metricsPromise); // suspends until resolved
  return <div>{data.uptime}</div>;
}

// Parent wraps with Suspense to catch the suspension
<Suspense fallback={<Spinner />}>
  <Metrics />
</Suspense>
```
**Key difference from useContext:** `use()` can be called conditionally.

### useOptimistic
```tsx
const [optimisticProjects, updateOptimistic] = useOptimistic(
  state.projects,
  (current, action: { type: "delete"; id: string }) =>
    current.filter(p => p.id !== action.id)
);

async function handleDelete(id: string) {
  updateOptimistic({ type: "delete", id }); // instant UI update
  await deleteProjectOnServer(id);          // actual async call
  // if server call fails, optimistic state rolls back automatically
}
```

### useActionState
```tsx
async function saveProfile(prev: State, formData: FormData): Promise<State> {
  await updateUser({ name: formData.get("name") as string });
  return { success: true, message: "Saved!" };
}

const [state, action, isPending] = useActionState(saveProfile, { success: false });

<form action={action}>
  <input name="name" />
  <button disabled={isPending}>{isPending ? "Saving…" : "Save"}</button>
  {state.success && <p>{state.message}</p>}
</form>
```

### useFormStatus
```tsx
// Must be called inside a child of the <form> element
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create Project"}
    </button>
  );
}

// The form uses action= (not onSubmit) for pending to work
<form action={asyncServerAction}>
  <input name="name" />
  <SubmitButton />  {/* reads pending state from parent form */}
</form>
```

---

## Custom Hooks

### useSearch (useDeferredValue + useMemo)
```tsx
export function useSearch<T extends object>(items: T[], keys: (keyof T)[]) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const isStale = query !== deferred;

  const results = useMemo(() => {
    if (!deferred) return items;
    const q = deferred.toLowerCase();
    return items.filter(item =>
      keys.some(k => String(item[k]).toLowerCase().includes(q))
    );
  }, [items, keys, deferred]);

  return { query, setQuery, results, isStale };
}
```

---

## Global State (Flux + Context)

```tsx
// AppContext.tsx — single source of truth
type AppAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_PAGE"; payload: Page }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_THEME":
      localStorage.setItem("nexus-theme", action.payload); // persistence
      return { ...state, theme: action.payload };
    // ...
  }
}

// Lazy initializer — runs once, reads localStorage before first render
function initState(): AppState {
  const theme = (localStorage.getItem("nexus-theme") as Theme) ?? "dark";
  document.documentElement.setAttribute("data-theme", theme);
  return { theme, page: "dashboard", projects: PROJECTS, sidebarOpen: true };
}

const [state, dispatch] = useReducer(appReducer, undefined, initState);
```

---

## Performance Patterns

| Technique | When to use |
|---|---|
| `React.memo` | Expensive components with stable props |
| `useMemo` | Expensive calculations (filtering, sorting large arrays) |
| `useCallback` | Functions passed as props to memoized children |
| `useTransition` | Non-urgent state updates (navigation, tab switches) |
| `useDeferredValue` | Keeping input responsive while filtering large lists |
| `lazy()` + `Suspense` | Page-level code splitting |
| `createPortal` | Modals, toasts, tooltips that need to escape overflow:hidden |

---

## What Was Built

### `nexus-dashboard/` — Professional SaaS Dashboard
- **Dashboard** — KPI cards, revenue chart, `use()` live metrics, activity feed
- **Projects** — CRUD with `useOptimistic`, search, `useFormStatus` in modal
- **Analytics** — Sortable table with `useDeferredValue` search, sparklines
- **Team** — HOC pattern, Render Props, `React.memo` member cards
- **Settings** — `useActionState` for async form submission

### UI System
- `Card` — Compound Component
- `Modal` — Compound Component + createPortal
- `Input` — React 19 ref-as-prop
- `Button`, `Badge`, `Avatar`, `StatCard`, `ProgressBar`
- `Toast` — createPortal notification system
- `CommandPalette` — Cmd+K, createPortal + `useDeferredValue`
- `NotificationsPanel` — createPortal slide-in drawer

### `fluent-react-lab/` — Interactive Chapter Demos
One runnable demo per chapter of *Fluent React* (Ch01–Ch10).
