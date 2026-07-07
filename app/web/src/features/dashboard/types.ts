export type TaskStatus = "todo" | "in_progress" | "in_review";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  repo?: string;
  branch?: string;
  priority?: "low" | "medium" | "high";
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
}
