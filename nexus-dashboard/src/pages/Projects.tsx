// Ch07: useOptimistic for instant CRUD feedback (React 19)
// Ch05: Compound Components (Modal, Card), Custom hooks
import { useState, useOptimistic, useTransition, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Avatar } from "../components/ui/Avatar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useSearch } from "../hooks/useSearch";
import type { Project } from "../data/mock";

const STATUS_VARIANT: Record<string, "success" | "warning" | "default"> = {
  active: "success", paused: "warning", completed: "default",
};
const PRIORITY_VARIANT: Record<string, "danger" | "warning" | "info"> = {
  high: "danger", medium: "warning", low: "info",
};

function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  return (
    <Card hoverable>
      <Card.Body style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {project.name}
            </h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge variant={STATUS_VARIANT[project.status]}>{project.status}</Badge>
              <Badge variant={PRIORITY_VARIANT[project.priority]}>{project.priority}</Badge>
            </div>
          </div>
          <button
            onClick={() => onDelete(project.id)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14, padding: 4, flexShrink: 0 }}
          >✕</button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
            <span>Progress</span><span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: -6 }}>
            {project.team.map((t, i) => (
              <div key={t} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                <Avatar initials={t} size={24} />
              </div>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Due {project.dueDate}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

function NewProjectModal({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (p: Project) => void;
}) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  function handleSubmit() {
    if (!name.trim()) return;
    const newProject: Project = {
      id: `p${Date.now()}`, name: name.trim(), status: "active",
      progress: 0, team: ["JD"], dueDate: "TBD", priority,
    };
    onAdd(newProject);
    setName("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>New Project</Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Project name" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Mobile App Redesign"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Priority</div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["low", "medium", "high"] as const).map(p => (
                <button
                  key={p} onClick={() => setPriority(p)}
                  style={{
                    flex: 1, padding: "7px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500,
                    border: `1px solid ${priority === p ? "var(--primary)" : "var(--border-strong)"}`,
                    background: priority === p ? "var(--primary-dim)" : "var(--bg-elevated)",
                    color: priority === p ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!name.trim()}>Create Project</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Projects() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // useOptimistic — Ch07 / React 19: instant UI update before server confirm
  const [optimisticProjects, updateOptimistic] = useOptimistic(
    state.projects,
    (current, action: { type: "delete"; id: string } | { type: "add"; project: Project }) => {
      if (action.type === "delete") return current.filter(p => p.id !== action.id);
      return [action.project, ...current];
    }
  );

  const { query, setQuery, results, isStale } = useSearch(optimisticProjects, ["name", "status", "priority"]);

  const handleDelete = useCallback((id: string) => {
    startTransition(async () => {
      updateOptimistic({ type: "delete", id });
      // Simulate async server call
      await new Promise(r => setTimeout(r, 300));
      dispatch({ type: "DELETE_PROJECT", payload: id });
    });
  }, [dispatch, updateOptimistic]);

  const handleAdd = useCallback((project: Project) => {
    startTransition(async () => {
      updateOptimistic({ type: "add", project });
      await new Promise(r => setTimeout(r, 300));
      dispatch({ type: "ADD_PROJECT", payload: project });
    });
  }, [dispatch, updateOptimistic]);

  const filterStatus = (status: string) =>
    status === "all" ? results : results.filter(p => p.status === status);

  const [tab, setTab] = useState<"all" | "active" | "paused" | "completed">("all");
  const shown = filterStatus(tab);

  return (
    <div style={{ padding: "24px" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <Input
          placeholder="Search projects..." value={query}
          onChange={e => setQuery(e.target.value)}
          icon={<span style={{ fontSize: 13 }}>⌕</span>}
          style={{ width: 260 }}
        />
        <div style={{ display: "flex", gap: 4, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: 3 }}>
          {(["all", "active", "paused", "completed"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500, border: "none",
              background: tab === t ? "var(--bg-surface)" : "transparent",
              color: tab === t ? "var(--text-primary)" : "var(--text-secondary)",
              cursor: "pointer", transition: "background 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button variant="primary" onClick={() => setModalOpen(true)} icon={<span>+</span>}>
            New Project
          </Button>
        </div>
      </div>

      {isStale && <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Filtering…</p>}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, opacity: isPending ? 0.7 : 1, transition: "opacity 0.2s" }}>
        {shown.map(p => <ProjectCard key={p.id} project={p} onDelete={handleDelete} />)}
        {shown.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 14 }}>
            No projects found
          </div>
        )}
      </div>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
