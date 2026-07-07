from pydantic import BaseModel


class TaskResolutionResult(BaseModel):
    matched: bool
    task_id: int | None = None
    confidence: float = 0.0
    match_reason: str | None = None
    should_auto_apply: bool = False
