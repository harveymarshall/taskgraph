import type { Task } from "../types";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
}

export function TaskColumn({ title, tasks }: TaskColumnProps) {
  return (
    <section className="task-column">
      <div className="task-column__header">
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      <div className="task-column__list">
        {tasks.map((task) => (
          <article key={task.id} className="task-card">
            <div className="task-card__top">
              <span className="task-card__id">{task.id}</span>
              {task.priority && (
                <span className={`task-card__priority task-card__priority--${task.priority}`}>
                  {task.priority}
                </span>
              )}
            </div>

            <h4>{task.title}</h4>

            {task.description ? <p>{task.description}</p> : null}

            <div className="task-card__meta">
              {task.repo ? <span>{task.repo}</span> : null}
              {task.branch ? <span>{task.branch}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
