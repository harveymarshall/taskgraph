import { useMemo, useState } from "react";
import { ActivityPanel } from "../features/dashboard/components/ActivityPanel";
import { DashboardHeader } from "../features/dashboard/components/DashboardHeader";
import { TaskColumn } from "../features/dashboard/components/TaskColumn";
import { TaskComposer } from "../features/dashboard/components/TaskComposer";
import { mockActivity, mockTasks } from "../features/dashboard/data/mockTasks";
import type { Task } from "../features/dashboard/types";

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  function handleAddTask(title: string, description: string) {
    const newTask: Task = {
      id: `TG-${100 + tasks.length + 1}`,
      title,
      description,
      status: "todo",
      priority: "medium",
      repo: "taskgraph-web",
    };

    setTasks((current) => [newTask, ...current]);
  }

  const grouped = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "todo"),
      inProgress: tasks.filter((task) => task.status === "in_progress"),
      inReview: tasks.filter((task) => task.status === "in_review"),
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

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <TaskComposer onAddTask={handleAddTask} />

          <div className="task-board">
            <TaskColumn title="Todo" tasks={grouped.todo} />
            <TaskColumn title="In Progress" tasks={grouped.inProgress} />
            <TaskColumn title="In Review" tasks={grouped.inReview} />
          </div>
        </div>

        <ActivityPanel items={mockActivity} />
      </div>
    </div>
  );
}
