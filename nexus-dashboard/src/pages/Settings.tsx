// Ch07 React 19: useActionState for async form handling
import { useActionState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { useApp } from "../context/AppContext";

type FormState = { success: boolean; error: string | null; saved: string | null };

// Server Action simulation (useActionState — React 19)
async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  await new Promise(r => setTimeout(r, 800)); // simulate network
  const name = formData.get("name") as string;
  if (!name?.trim()) return { success: false, error: "Name is required", saved: null };
  return { success: true, error: null, saved: name };
}

async function saveNotifs(_prev: FormState, _formData: FormData): Promise<FormState> {
  await new Promise(r => setTimeout(r, 500));
  return { success: true, error: null, saved: "Notification preferences updated" };
}

function ProfileSection() {
  const [state, action, isPending] = useActionState(saveProfile, { success: false, error: null, saved: null });

  return (
    <Card>
      <Card.Header>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Profile</span>
        {state.success && <Badge variant="success">Saved</Badge>}
      </Card.Header>
      <Card.Body>
        <form action={action}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20 }}>
            <Avatar initials="JD" size={64} status="online" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>James Doe</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 8px" }}>Admin · james@nexus.io</p>
              <Button variant="secondary" size="sm" type="button">Change Avatar</Button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <Input label="Full name" name="name" defaultValue="James Doe" error={state.error ?? undefined} />
            <Input label="Email" name="email" type="email" defaultValue="james@nexus.io" />
            <Input label="Role" name="role" defaultValue="Lead Engineer" />
            <Input label="Location" name="location" defaultValue="San Francisco, CA" />
          </div>
          <Input label="Bio" name="bio" defaultValue="Building the future, one commit at a time." style={{ marginBottom: 16 }} />

          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save Profile"}
          </Button>
          {state.saved && <span style={{ fontSize: 12, color: "var(--success)", marginLeft: 12 }}>✓ Profile saved as "{state.saved}"</span>}
        </form>
      </Card.Body>
    </Card>
  );
}

function NotificationsSection() {
  const [state, action, isPending] = useActionState(saveNotifs, { success: false, error: null, saved: null });

  const options = [
    { name: "email_deploy", label: "Deployment alerts", desc: "Get notified when a deploy succeeds or fails", defaultChecked: true },
    { name: "email_pr", label: "Pull request activity", desc: "Comments, reviews, and merges", defaultChecked: true },
    { name: "email_mentions", label: "Mentions", desc: "When someone @mentions you", defaultChecked: true },
    { name: "email_weekly", label: "Weekly digest", desc: "Summary of activity across your projects", defaultChecked: false },
  ];

  return (
    <Card>
      <Card.Header>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Notifications</span>
        {state.success && <Badge variant="success">Saved</Badge>}
      </Card.Header>
      <Card.Body>
        <form action={action}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {options.map((opt, i) => (
              <label key={opt.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "14px 0", cursor: "pointer",
                borderBottom: i < options.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{opt.desc}</div>
                </div>
                <input type="checkbox" name={opt.name} defaultChecked={opt.defaultChecked}
                  style={{ marginTop: 2, accentColor: "var(--primary)", width: 16, height: 16, cursor: "pointer" }} />
              </label>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save Preferences"}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}

function AppearanceSection() {
  const { state, toggleTheme } = useApp();
  return (
    <Card>
      <Card.Header><span style={{ fontSize: 14, fontWeight: 600 }}>Appearance</span></Card.Header>
      <Card.Body>
        <div style={{ display: "flex", gap: 12 }}>
          {(["dark", "light"] as const).map(t => (
            <button key={t} onClick={() => { if (state.theme !== t) toggleTheme(); }}
              style={{
                flex: 1, padding: "16px", borderRadius: "var(--radius-md)", cursor: "pointer",
                border: `2px solid ${state.theme === t ? "var(--primary)" : "var(--border-strong)"}`,
                background: state.theme === t ? "var(--primary-dim)" : "var(--bg-elevated)",
                color: state.theme === t ? "var(--primary)" : "var(--text-secondary)",
              }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{t === "dark" ? "🌙" : "☀️"}</div>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{t} Mode</div>
            </button>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

function DangerZone() {
  return (
    <Card style={{ borderColor: "var(--danger-dim)" }}>
      <Card.Header style={{ borderColor: "var(--danger-dim)" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--danger)" }}>Danger Zone</span>
      </Card.Header>
      <Card.Body>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Delete workspace</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Permanently delete this workspace and all its data</div>
          </div>
          <Button variant="danger" size="sm">Delete Workspace</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function Settings() {
  return (
    <div style={{ padding: "24px", maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>
      <ProfileSection />
      <NotificationsSection />
      <AppearanceSection />
      <DangerZone />
    </div>
  );
}
