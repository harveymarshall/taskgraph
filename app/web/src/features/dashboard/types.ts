export type TaskStatus = "todo" | "in_progress" | "in_review" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  github_repo?: string | null;
  branch_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  github_repo?: string;
  branch_name?: string;
}

export interface TaskListResponse {
  items: Task[];
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
}
