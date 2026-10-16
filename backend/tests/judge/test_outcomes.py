import pytest


PASSED_CODE = {
    "last-k-total": "def last_k_total(marks, k):\n    if not marks or k <= 0:\n        return 0\n    start_index = max(0, len(marks) - k)\n    return sum(marks[start_index:])\n",
    "count-passes": "def count_passes(marks):\n    passes = 0\n    for mark in marks:\n        if mark >= 40:\n            passes += 1\n    return passes\n",
    "first-n-squares": "def first_n_squares(n):\n    squares = []\n    for i in range(1, n + 1):\n        squares.append(i * i)\n    return squares\n",
}

WRONG_CODE = {
    "last-k-total": "def last_k_total(marks, k):\n    return sum(marks[:k])\n",
    "count-passes": "def count_passes(marks):\n    return len(marks)\n",
    "first-n-squares": "def first_n_squares(n):\n    return [i * i for i in range(n)]\n",
}

RUNTIME_ERROR_CODE = {
    "last-k-total": "def last_k_total(marks, k):\n    return 1 / 0\n",
    "count-passes": "def count_passes(marks):\n    return 1 / 0\n",
    "first-n-squares": "def first_n_squares(n):\n    return 1 / 0\n",
}

TIMEOUT_CODE = {
    "last-k-total": "def last_k_total(marks, k):\n    while True:\n        pass\n",
    "count-passes": "def count_passes(marks):\n    while True:\n        pass\n",
    "first-n-squares": "def first_n_squares(n):\n    while True:\n        pass\n",
}


@pytest.mark.parametrize(
    "challenge_id, code_key, expected",
    [
        ("last-k-total", "pass", "passed"),
        ("last-k-total", "wrong", "wrong output"),
        ("last-k-total", "runtime", "runtime error"),
        ("last-k-total", "timeout", "timeout"),
        ("count-passes", "pass", "passed"),
        ("count-passes", "wrong", "wrong output"),
        ("count-passes", "runtime", "runtime error"),
        ("count-passes", "timeout", "timeout"),
        ("first-n-squares", "pass", "passed"),
        ("first-n-squares", "wrong", "wrong output"),
        ("first-n-squares", "runtime", "runtime error"),
        ("first-n-squares", "timeout", "timeout"),
    ],
)
def test_exact_outcome_classification(client, challenge_id, code_key, expected):
    code_map = {
        "pass": PASSED_CODE,
        "wrong": WRONG_CODE,
        "runtime": RUNTIME_ERROR_CODE,
        "timeout": TIMEOUT_CODE,
    }
    payload = {
        "learner_id": f"judge-{challenge_id}-{code_key}",
        "challenge_id": challenge_id,
        "code": code_map[code_key][challenge_id],
    }
    response = client.post("/api/submit", json=payload)
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["overall_status"] == expected, body

    if code_key == "pass":
        assert body.get("mistake_category") in (None, "") or "mistake_category" not in body
