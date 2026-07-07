import re
from difflib import SequenceMatcher

from sqlmodel import Session, select

from app.models.task import Task
from app.schemas.github_event import GitHubTaskEvent
from app.schemas.task_resolution import TaskResolutionResult


AUTO_APPLY_THRESHOLD = 0.85
SUGGEST_THRESHOLD = 0.60


def normalize_text(value: str | None) -> str:
    if not value:
        return ""
    value = value.lower().strip()
    value = value.replace("_", " ").replace("-", " ").replace("/", " ")
    value = re.sub(r"[^a-z0-9\s]", " ", value)
    value = re.sub(r"\s+", " ", value)
    return value


def extract_numeric_tokens(value: str | None) -> set[str]:
    if not value:
        return set()
    return set(re.findall(r"\d+", value))


def similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


def token_overlap_score(a: str, b: str) -> float:
    a_tokens = set(a.split())
    b_tokens = set(b.split())

    if not a_tokens or not b_tokens:
        return 0.0

    overlap = a_tokens.intersection(b_tokens)
    return len(overlap) / max(len(a_tokens), len(b_tokens))


def build_candidate_score(task: Task, event: GitHubTaskEvent) -> tuple[float, str]:
    branch = normalize_text(event.branch_name)
    title = normalize_text(task.title)
    repo_bonus = 0.0

    if event.github_repo and task.github_repo and event.github_repo == task.github_repo:
        repo_bonus = 0.15

    branch_numbers = extract_numeric_tokens(event.branch_name)
    task_numbers = extract_numeric_tokens(task.title)

    if str(task.id) in branch_numbers:
        return 0.95 + repo_bonus, "task id found in branch name"

    if branch_numbers and task_numbers and branch_numbers.intersection(task_numbers):
        return 0.88 + repo_bonus, "shared numeric token between branch and task title"

    fuzzy_score = similarity(branch, title)
    overlap_score = token_overlap_score(branch, title)

    final_score = max(fuzzy_score, overlap_score) + repo_bonus
    return min(final_score, 0.99), "fuzzy branch/title match"


def resolve_task_for_event(session: Session, event: GitHubTaskEvent) -> TaskResolutionResult:
    if event.task_id is not None:
        task = session.get(Task, event.task_id)
        if task:
            return TaskResolutionResult(
                matched=True,
                task_id=task.id,
                confidence=1.0,
                match_reason="task_id supplied in event",
                should_auto_apply=True,
            )

    statement = select(Task)
    if event.github_repo:
        statement = statement.where(Task.github_repo == event.github_repo)

    candidates = list(session.exec(statement).all())

    if not candidates:
        return TaskResolutionResult(matched=False)

    scored: list[tuple[Task, float, str]] = []

    for task in candidates:
        score, reason = build_candidate_score(task, event)
        scored.append((task, score, reason))

    scored.sort(key=lambda row: row[1], reverse=True)
    best_task, best_score, best_reason = scored[0]

    if best_score >= AUTO_APPLY_THRESHOLD:
        return TaskResolutionResult(
            matched=True,
            task_id=best_task.id,
            confidence=best_score,
            match_reason=best_reason,
            should_auto_apply=True,
        )

    if best_score >= SUGGEST_THRESHOLD:
        return TaskResolutionResult(
            matched=True,
            task_id=best_task.id,
            confidence=best_score,
            match_reason=best_reason,
            should_auto_apply=False,
        )

    return TaskResolutionResult(matched=False)
