from sqlmodel import Session

from app.schemas.github_event import GitHubTaskEvent
from app.services.task_automation_service import process_github_task_event


def run_task_status_agent(session: Session, event: GitHubTaskEvent):
    return process_github_task_event(session, event)
