import { useState } from "react";
import type { TaskCreateInput, TaskPriority } from "../types";

interface TaskComposerProps {
  onAddTask: (task: TaskCreateInput) => Promise<void>;
  isSubmitting: boolean;
}

export function TaskComposer({ onAddTask, isSubmitting }: TaskComposerProps) {
  const [form, setForm] = useState<TaskCreateInput>({
    title: "",
    description: "",
    priority: "medium",
    github_repo: "",
    branch_name: "",
  });

  function updateField<K extends keyof TaskCreateInput>(key: K, value: TaskCreateInput[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) return;

    await onAddTask({
      title: form.title.trim(),
      description: form.description?.trim() || "",
      priority: form.priority as TaskPriority,
      github_repo: form.github_repo?.trim() || "",
      branch_name: form.branch_name?.trim() || "",
    });

    setForm({
      title: "",
      description: "",
      priority: "medium",
      github_repo: "",
      branch_name: "",
    });
  }

  return (
    <section className="task-composer">
      <div className="task-composer__header">
        <h2>Add task</h2>
        <p>Create a real task in the backend and show it on the board.</p>
      </div>

      <form className="task-composer__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <textarea
          placeholder="Short description"
          value={form.description ?? ""}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
        />

        <div className="task-composer__row">
          <select
            value={form.priority}
            onChange={(e) => updateField("priority", e.target.value as TaskPriority)}
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <input
            type="text"
            placeholder="GitHub repo"
            value={form.github_repo ?? ""}
            onChange={(e) => updateField("github_repo", e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Branch name (optional)"
          value={form.branch_name ?? ""}
          onChange={(e) => updateField("branch_name", e.target.value)}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Add task"}
        </button>
      </form>
    </section>
  );
}
