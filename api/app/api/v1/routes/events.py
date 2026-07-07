from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.agents.task_agent import run_task_status_agent
from app.core.db import get_session
from app.schemas.github_event import GitHubTaskEvent

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/github")
def post_github_event(
    payload: GitHubTaskEvent,
    session: Session = Depends(get_session),
):
    return run_task_status_agent(session, payload)
