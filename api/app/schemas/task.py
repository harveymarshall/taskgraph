from enum import Enum
from pydantic import BaseModel


class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    in_review = "in_review"
    done = "done"
    blocked = "blocked"


class Task(BaseModel):
    id: str
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.todo
