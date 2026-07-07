from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def list_tasks(session: Session) -> list[Task]:
    statement = select(Task).order_by(Task.created_at.desc())
    return list(session.exec(statement).all())


def get_task_by_id(session: Session, task_id: int) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task



def create_task(session: Session, payload: TaskCreate) -> Task:
    task = Task(
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        github_repo=payload.github_repo,
        branch_name=payload.branch_name,
        updated_at=datetime.now(timezone.utc),
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def update_task(session: Session, task_id: int, payload: TaskUpdate) -> Task:
    task = get_task_by_id(session, task_id)

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task
