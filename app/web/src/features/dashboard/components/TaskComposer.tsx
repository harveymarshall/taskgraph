import { useState } from "react";

interface TaskComposerProps {
  onAddTask: (title: string, description: string) => void;
}

export function TaskComposer({ onAddTask }: TaskComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    onAddTask(title.trim(), description.trim());
    setTitle("");
    setDescription("");
    setSeverity("");
  }

  return (
    <section className="task-composer">
      <div className="task-composer__header">
        <h2>Add task</h2>
        <p>Create a task before linking branches and PR activity.</p>
      </div>

      <form className="task-composer__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <button type="submit">Add task</button>
      </form>
    </section>
  );
}
