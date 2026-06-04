export type Project = {
  id: string; name: string; status: "active" | "paused" | "completed";
  progress: number; team: string[]; dueDate: string; priority: "low" | "medium" | "high";
};

export type TeamMember = {
  id: string; name: string; role: string; email: string;
  avatar: string; status: "online" | "away" | "offline"; projects: number;
};

export type AnalyticsRow = {
  id: string; page: string; views: number; visitors: number;
  bounceRate: number; avgTime: string; trend: "up" | "down" | "flat";
};

export type Activity = {
  id: string; user: string; avatar: string; action: string;
  target: string; time: string;
};

export const PROJECTS: Project[] = [
  { id: "p1", name: "Nexus Mobile App", status: "active", progress: 72, team: ["AK", "SM", "JD"], dueDate: "Jul 15", priority: "high" },
  { id: "p2", name: "API Gateway v3", status: "active", progress: 45, team: ["JD", "LR"], dueDate: "Jul 28", priority: "high" },
  { id: "p3", name: "Design System 2.0", status: "active", progress: 88, team: ["SM", "TC", "AK"], dueDate: "Jul 8", priority: "medium" },
  { id: "p4", name: "Data Pipeline Refactor", status: "paused", progress: 30, team: ["LR", "MK"], dueDate: "Aug 5", priority: "medium" },
  { id: "p5", name: "Customer Portal", status: "active", progress: 61, team: ["TC", "JD", "SM"], dueDate: "Jul 22", priority: "high" },
  { id: "p6", name: "Auth Service Migration", status: "completed", progress: 100, team: ["AK", "MK"], dueDate: "Jun 30", priority: "low" },
  { id: "p7", name: "Analytics Dashboard", status: "active", progress: 54, team: ["SM", "JD"], dueDate: "Aug 12", priority: "medium" },
  { id: "p8", name: "Payment Integration", status: "paused", progress: 20, team: ["MK", "LR", "TC"], dueDate: "Aug 20", priority: "low" },
];

export const TEAM: TeamMember[] = [
  { id: "t1", name: "Alex Kim", role: "Lead Engineer", email: "alex@nexus.io", avatar: "AK", status: "online", projects: 4 },
  { id: "t2", name: "Sara Mills", role: "Frontend Engineer", email: "sara@nexus.io", avatar: "SM", status: "online", projects: 5 },
  { id: "t3", name: "James Doe", role: "Backend Engineer", email: "james@nexus.io", avatar: "JD", status: "away", projects: 4 },
  { id: "t4", name: "Lena Ray", role: "DevOps Engineer", email: "lena@nexus.io", avatar: "LR", status: "online", projects: 3 },
  { id: "t5", name: "Tom Chen", role: "Full Stack Engineer", email: "tom@nexus.io", avatar: "TC", status: "offline", projects: 4 },
  { id: "t6", name: "Maya Kline", role: "Data Engineer", email: "maya@nexus.io", avatar: "MK", status: "online", projects: 3 },
];

export const ANALYTICS: AnalyticsRow[] = [
  { id: "a1", page: "/dashboard", views: 12840, visitors: 4210, bounceRate: 18, avgTime: "4m 32s", trend: "up" },
  { id: "a2", page: "/projects", views: 8920, visitors: 3100, bounceRate: 22, avgTime: "6m 14s", trend: "up" },
  { id: "a3", page: "/analytics", views: 6430, visitors: 2800, bounceRate: 31, avgTime: "3m 48s", trend: "flat" },
  { id: "a4", page: "/team", views: 4210, visitors: 1940, bounceRate: 28, avgTime: "2m 05s", trend: "down" },
  { id: "a5", page: "/settings", views: 3180, visitors: 1620, bounceRate: 45, avgTime: "1m 22s", trend: "flat" },
  { id: "a6", page: "/login", views: 9800, visitors: 9800, bounceRate: 12, avgTime: "0m 48s", trend: "up" },
  { id: "a7", page: "/docs", views: 5500, visitors: 2200, bounceRate: 35, avgTime: "8m 10s", trend: "up" },
  { id: "a8", page: "/api", views: 2100, visitors: 800, bounceRate: 60, avgTime: "1m 05s", trend: "down" },
  { id: "a9", page: "/pricing", views: 7700, visitors: 5100, bounceRate: 52, avgTime: "2m 30s", trend: "up" },
  { id: "a10", page: "/blog", views: 3300, visitors: 2900, bounceRate: 25, avgTime: "5m 18s", trend: "flat" },
];

export const ACTIVITY: Activity[] = [
  { id: "ac1", user: "Alex Kim", avatar: "AK", action: "pushed 3 commits to", target: "Nexus Mobile App", time: "2m ago" },
  { id: "ac2", user: "Sara Mills", avatar: "SM", action: "completed task in", target: "Design System 2.0", time: "14m ago" },
  { id: "ac3", user: "James Doe", avatar: "JD", action: "opened a PR in", target: "API Gateway v3", time: "1h ago" },
  { id: "ac4", user: "Lena Ray", avatar: "LR", action: "deployed", target: "Auth Service Migration", time: "2h ago" },
  { id: "ac5", user: "Tom Chen", avatar: "TC", action: "commented on", target: "Customer Portal", time: "3h ago" },
  { id: "ac6", user: "Maya Kline", avatar: "MK", action: "updated pipeline in", target: "Data Pipeline Refactor", time: "5h ago" },
];

export const CHART_DATA = [
  { month: "Jan", revenue: 42000, users: 1200 },
  { month: "Feb", revenue: 48000, users: 1420 },
  { month: "Mar", revenue: 45000, users: 1380 },
  { month: "Apr", revenue: 61000, users: 1810 },
  { month: "May", revenue: 58000, users: 1750 },
  { month: "Jun", revenue: 72000, users: 2100 },
];
