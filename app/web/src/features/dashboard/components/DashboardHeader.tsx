import { StatCard } from "../../../components/ui/StatCard";

interface DashboardHeaderProps {
  totalTasks: number;
  inProgress: number;
  inReview: number;
}

export function DashboardHeader({
  totalTasks,
  inProgress,
  inReview,
}: DashboardHeaderProps) {
  return (
    <section className="dashboard-header">
      <div>
        <p className="dashboard-header__eyebrow">Workspace</p>
        <h1>Dashboard</h1>
        <p className="dashboard-header__copy">
          Manage tasks, track delivery state, and prepare for GitHub-linked automation.
        </p>
      </div>

      <div className="dashboard-header__stats">
        <StatCard label="Total tasks" value={totalTasks} />
        <StatCard label="In progress" value={inProgress} />
        <StatCard label="In review" value={inReview} />
      </div>
    </section>
  );
}
