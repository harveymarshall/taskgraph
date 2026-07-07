from fastapi import HTTPException
from sqlmodel import Session

from app.models.task import Task, TaskStatus
from app.schemas.github_event import GitHubTaskEvent
from app.schemas.task import TaskUpdate
from app.services.task_resolution_service import resolve_task_for_event
from app.services.task_service import get_task_by_id, update_task


def determine_status_update(event: GitHubTaskEvent) -> TaskStatus:
    if event.event_type == "branch_created":
        return TaskStatus.in_progress

    if event.event_type == "pull_request_opened":
        return TaskStatus.in_review

    if event.event_type == "pull_request_merged":
        return TaskStatus.done

    raise HTTPException(status_code=400, detail="Unsupported event type")


def process_github_task_event(session: Session, event: GitHubTaskEvent) -> dict:
    resolution = resolve_task_for_event(session, event)

    if not resolution.matched:
        return {
            "updated": False,
            "suggested": False,
            "message": "No task match found for event",
        }

    if not resolution.should_auto_apply:
        return {
            "updated": False,
            "suggested": True,
            "task_id": resolution.task_id,
            "confidence": resolution.confidence,
            "reason": resolution.match_reason,
            "message": "Suggested task match found; awaiting confirmation",
        }

    task = get_task_by_id(session, resolution.task_id)
    next_status = determine_status_update(event)

    payload = TaskUpdate(
        status=next_status,
        github_repo=event.github_repo,
        branch_name=event.branch_name or task.branch_name,
    )

    updated_task = update_task(session, task.id, payload)

    return {
        "updated": True,
        "suggested": False,
        "task_id": updated_task.id,
        "confidence": resolution.confidence,
        "reason": resolution.match_reason,
        "new_status": updated_task.status,
        "message": "Task updated from GitHub event",
    }
