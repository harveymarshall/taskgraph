from enum import Enum
from typing import Optional

from pydantic import BaseModel


class GitHubEventType(str, Enum):
    branch_created = "branch_created"
    pull_request_opened = "pull_request_opened"
    pull_request_merged = "pull_request_merged"


class GitHubTaskEvent(BaseModel):
    event_type: GitHubEventType
    github_repo: str
    branch_name: Optional[str] = None
    pr_number: Optional[int] = None
    task_id: Optional[int] = None
