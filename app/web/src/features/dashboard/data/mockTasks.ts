import type { ActivityItem, Task } from "../types";

export const mockTasks: Task[] = [
  {
    id: "TG-101",
    title: "Create FastAPI task routes",
    description: "Set up initial task endpoints and health checks.",
    status: "todo",
    priority: "high",
    repo: "taskgraph-api",
  },
  {
    id: "TG-102",
    title: "Build dashboard task columns",
    description: "Render grouped task cards by status in the React app.",
    status: "in_progress",
    priority: "medium",
    repo: "taskgraph-web",
    branch: "feature/dashboard-columns",
  },
  {
    id: "TG-103",
    title: "Design suggested link schema",
    description: "Define how task-to-branch recommendations are stored.",
    status: "in_review",
    priority: "medium",
    repo: "taskgraph-api",
    branch: "feature/link-schema",
  },
];

export const mockActivity: ActivityItem[] = [
  { id: "1", text: "Agent proposed link for TG-103 → feature/link-schema", time: "5m ago" },
  { id: "2", text: "Branch created for TG-102 in taskgraph-web", time: "18m ago" },
  { id: "3", text: "Task TG-101 created from dashboard", time: "32m ago" },
];
