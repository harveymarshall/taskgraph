import type { Task, TaskCreateInput, TaskListResponse } from "../types";

const API_BASE = "/api/v1";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data: TaskListResponse = await response.json();
  return data.items;
}

export async function createTask(payload: TaskCreateInput): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const data: Task = await response.json();
  return data;
}
