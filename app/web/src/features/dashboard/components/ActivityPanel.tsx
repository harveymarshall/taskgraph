import type { ActivityItem } from "../types";

interface ActivityPanelProps {
  items: ActivityItem[];
}

export function ActivityPanel({ items }: ActivityPanelProps) {
  return (
    <aside className="activity-panel">
      <div className="activity-panel__header">
        <h3>Agent activity</h3>
        <p>Future GitHub and agent events will appear here.</p>
      </div>

      <div className="activity-panel__list">
        {items.map((item) => (
          <div key={item.id} className="activity-item">
            <p>{item.text}</p>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
