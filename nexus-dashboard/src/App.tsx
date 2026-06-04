// Ch05: lazy + Suspense for page-level code splitting
// Ch04: Error Boundary wrapping each page
import { lazy, Suspense, Component, type ReactNode } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";

// Lazy-loaded pages — each is a separate JS chunk
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects   = lazy(() => import("./pages/Projects"));
const Analytics  = lazy(() => import("./pages/Analytics"));
const Team       = lazy(() => import("./pages/Team"));
const Settings   = lazy(() => import("./pages/Settings"));

// Error Boundary — Ch05 (must be class component)
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠</div>
        <p style={{ color: "var(--danger)", fontWeight: 600 }}>Something went wrong</p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>
          {(this.state.error as Error).message}
        </p>
        <button
          onClick={() => this.setState({ error: null })}
          style={{ marginTop: 16, background: "var(--primary)", border: "none", color: "#fff", padding: "8px 18px", borderRadius: "var(--radius-md)", cursor: "pointer" }}
        >
          Try again
        </button>
      </div>
    );
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh", gap: 12, color: "var(--text-muted)" }}>
      <div style={{ width: 16, height: 16, border: "2px solid var(--border-strong)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      Loading…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const PAGE_MAP: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  dashboard: Dashboard,
  projects:  Projects,
  analytics: Analytics,
  team:      Team,
  settings:  Settings,
};

function AppShell() {
  const { state } = useApp();
  const ActivePage = PAGE_MAP[state.page];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        <Header />
        <main style={{ flex: 1, overflowY: "auto" }}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <ActivePage />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
