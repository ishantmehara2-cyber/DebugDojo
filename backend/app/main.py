"""FastAPI backend for Debug Dojo challenge submissions."""

from __future__ import annotations

from collections import defaultdict
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from .challenges import CHALLENGES
from .sandbox import run_submission

app = FastAPI(title="Debug Dojo")


class SubmitRequest(BaseModel):
    learner_id: str = Field(..., min_length=1)
    challenge_id: str = Field(..., min_length=1)
    code: str = Field(..., min_length=1)


class HintRequest(BaseModel):
    learner_id: str = Field(..., min_length=1)
    challenge_id: str = Field(..., min_length=1)
    hint_index: int | None = None


class HealthResponse(BaseModel):
    status: str


SUBMISSION_STORE: dict[str, list[dict[str, Any]]] = defaultdict(list)
MISTAKE_STORE: dict[str, dict[str, set[str]]] = defaultdict(lambda: defaultdict(set))
MASTERY_STORE: dict[str, dict[str, float]] = defaultdict(dict)
HINT_TRACKER: dict[str, dict[str, int]] = defaultdict(dict)


def _safe_error(detail: str, status_code: int = 400):
    return HTTPException(status_code=status_code, detail=detail)


def _normalize_result(result: dict[str, Any]) -> dict[str, Any]:
    payload = {
        "overall_status": result.get("overall_status", "wrong output"),
        "safe_message": result.get("safe_message", "The submission did not match the expected output."),
        "detail": result.get("detail"),
    }
    if payload["overall_status"] == "passed":
        payload["mistake_category"] = None
    return payload


def _record_mistake(learner_id: str, challenge_id: str, category: str):
    MISTAKE_STORE[learner_id][category].add(challenge_id)


def _get_recurring_categories(learner_id: str) -> list[str]:
    categories = []
    for category, challenge_ids in MISTAKE_STORE.get(learner_id, {}).items():
        if len(challenge_ids) >= 2:
            categories.append(category)
    return categories


def _get_next_challenge(learner_id: str) -> tuple[str | None, str | None]:
    recurring = _get_recurring_categories(learner_id)
    if recurring:
        target = recurring[0]
        for challenge_id in CHALLENGES:
            challenge = CHALLENGES[challenge_id]
            if target in challenge["mistake_categories"]:
                return challenge_id, f"You have encountered {target.replace('_', ' ')} in two different challenges."
        return None, None

    for challenge_id in CHALLENGES:
        if not any(sub.get("challenge_id") == challenge_id for sub in SUBMISSION_STORE.get(learner_id, [])):
            return challenge_id, "Start with a fresh challenge to build momentum."
    return None, None


def _update_mastery(learner_id: str, challenge_id: str, status: str, hint_count: int):
    challenge = CHALLENGES[challenge_id]
    current = MASTERY_STORE[learner_id]
    for tag in challenge.get("concept_tags", []):
        value = current.get(tag, 50.0)
        if status == "passed":
            delta = 12.0 if hint_count == 0 else 4.0
        elif status == "timeout":
            delta = -8.0
        else:
            delta = -6.0
        updated = max(0.0, min(100.0, value + delta))
        current[tag] = updated
    MASTERY_STORE[learner_id] = current


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/submit")
def submit_submission(payload: SubmitRequest):
    if not payload.learner_id:
        raise _safe_error("missing learner_id", 400)
    if not payload.challenge_id:
        raise _safe_error("missing challenge_id", 400)
    if not payload.code:
        raise _safe_error("missing code", 400)
    if payload.challenge_id not in CHALLENGES:
        raise _safe_error("unknown challenge", 404)

    challenge = CHALLENGES[payload.challenge_id]
    result = run_submission(challenge, payload.code)
    cleaned = _normalize_result(result)

    entry = {
        "learner_id": payload.learner_id,
        "challenge_id": payload.challenge_id,
        "overall_status": cleaned["overall_status"],
        "safe_message": cleaned["safe_message"],
        "detail": cleaned["detail"],
    }
    SUBMISSION_STORE[payload.learner_id].append(entry)

    if cleaned["overall_status"] == "wrong output" and challenge.get("mistake_categories"):
        category = challenge["mistake_categories"][0]
        _record_mistake(payload.learner_id, payload.challenge_id, category)
        cleaned["mistake_category"] = category

    challenge_explanation = challenge.get("explanation", {})
    cleaned["explanation"] = {
        "WHAT HAPPENED": challenge_explanation.get("what_happened", "The submission failed a required check."),
        "WHERE TO INVESTIGATE": challenge_explanation.get("where_to_investigate", "Inspect the failing logic."),
        "WHY IT MATTERS": challenge_explanation.get("why_it_matters", "It affects correctness or reliability."),
        "THINK ABOUT THIS": challenge_explanation.get("think_about_this", "Consider the edge case and required behavior."),
    }

    _update_mastery(payload.learner_id, payload.challenge_id, cleaned["overall_status"], 0)

    return JSONResponse(content={
        "learner_id": payload.learner_id,
        "challenge_id": payload.challenge_id,
        **cleaned,
    })


@app.post("/api/hint")
def request_hint(payload: HintRequest):
    if not payload.learner_id:
        raise _safe_error("missing learner_id", 400)
    if not payload.challenge_id:
        raise _safe_error("missing challenge_id", 400)
    if payload.challenge_id not in CHALLENGES:
        raise _safe_error("unknown challenge", 404)

    challenge = CHALLENGES[payload.challenge_id]
    requested = payload.hint_index if payload.hint_index is not None else 0
    hints = challenge["hints"]

    if requested >= len(hints):
        return JSONResponse(content={
            "hint": "No additional hints are available for this challenge.",
            "hint_index": requested,
            "exhausted": True,
        })

    HINT_TRACKER[payload.learner_id][payload.challenge_id] = requested + 1
    return JSONResponse(content={
        "hint": hints[requested],
        "hint_index": requested,
        "exhausted": False,
    })


@app.get("/api/learner/{learner_id}")
def get_learner(learner_id: str):
    challenge_id, reason = _get_next_challenge(learner_id)
    if challenge_id is None:
        return JSONResponse(content={
            "learner_id": learner_id,
            "next_challenge": None,
            "reason": "No active recommendation.",
            "mastery": MASTERY_STORE.get(learner_id, {}),
        })

    return JSONResponse(content={
        "learner_id": learner_id,
        "next_challenge": challenge_id,
        "reason": reason,
        "mastery": MASTERY_STORE.get(learner_id, {}),
    })
