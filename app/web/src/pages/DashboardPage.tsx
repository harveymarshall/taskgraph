import { useEffect, useMemo, useState } from "react";
import { ActivityPanel } from "../features/dashboard/components/ActivityPanel";
import { DashboardHeader } from "../features/dashboard/components/DashboardHeader";
import { TaskColumn } from "../features/dashboard/components/TaskColumn";
import { TaskComposer } from "../features/dashboard/components/TaskComposer";
import { mockActivity } from "../features/dashboard/data/mockTasks";
import { createTask, fetchTasks } from "../features/dashboard/services/tasks";
import type { Task, TaskCreateInput } from "../features/dashboard/types";

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        setError(null);
        const items = await fetchTasks();
        setTasks(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  async function handleAddTask(payload: TaskCreateInput) {
    try {
      setIsSubmitting(true);
      setError(null);
      const created = await createTask(payload);
      setTasks((current) => [created, ...current]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  const grouped = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "todo"),
      blocked: tasks.filter((task) => task.status === "blocked"),
      inProgress: tasks.filter((task) => task.status === "in_progress"),
      inReview: tasks.filter((task) => task.status === "in_review"),
      done: tasks.filter((task) => task.status === "done"),
    }),
    [tasks]
  );

  return (
    <div className="dashboard-page">
      <DashboardHeader
        totalTasks={tasks.length}
        inProgress={grouped.inProgress.length}
        inReview={grouped.inReview.length}
      />

      {error ? <div className="dashboard-banner dashboard-banner--error">{error}</div> : null}
      {isLoading ? <div className="dashboard-banner">Loading tasks...</div> : null}

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <TaskComposer onAddTask={handleAddTask} isSubmitting={isSubmitting} />

          <div className="task-board">
            <TaskColumn title="Todo" tasks={grouped.todo} />
            <TaskColumn title="Blocked" tasks={grouped.blocked} />
            <TaskColumn title="In Progress" tasks={grouped.inProgress} />
            <TaskColumn title="In Review" tasks={grouped.inReview} />
            <TaskColumn title="Done" tasks={grouped.done} />
          </div>
        </div>

        <ActivityPanel items={mockActivity} />
      </div>
    </div>
  );
}
