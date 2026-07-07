from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.core.db import get_session
from app.schemas.task import TaskCreate, TaskListResponse, TaskRead, TaskUpdate
from app.services.task_service import create_task, list_tasks, update_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=TaskListResponse)
def get_tasks(session: Session = Depends(get_session)) -> TaskListResponse:
    tasks = list_tasks(session)
    return TaskListResponse(items=[TaskRead.model_validate(task) for task in tasks])


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def post_task(
    payload: TaskCreate,
    session: Session = Depends(get_session),
) -> TaskRead:
    task = create_task(session, payload)
    return TaskRead.model_validate(task)


@router.patch("/{task_id}", response_model=TaskRead)
def patch_task(
    task_id: int,
    payload: TaskUpdate,
    session: Session = Depends(get_session),
) -> TaskRead:
    task = update_task(session, task_id, payload)
    return TaskRead.model_validate(task)
