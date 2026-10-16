"""Challenge catalog used by the backend judge and coaching system."""

from __future__ import annotations

CHALLENGES = {
    "last-k-total": {
        "id": "last-k-total",
        "title": "Last K Total",
        "difficulty": "Easy",
        "category": "BOUNDARY LOGIC",
        "function_name": "last_k_total",
        "description": "Return the total sum of the last k items in marks.",
        "concept_tags": ["Lists", "Indexing", "Loops", "Boundaries"],
        "starter_code": (
            "def last_k_total(marks, k):\n"
            "    total = 0\n"
            "    start_index = len(marks) - k\n"
            "    for i in range(start_index, len(marks)):\n"
            "        total += marks[i]\n"
            "    return total\n"
        ),
        "solution_code": (
            "def last_k_total(marks, k):\n"
            "    if not marks or k <= 0:\n"
            "        return 0\n"
            "    start_index = max(0, len(marks) - k)\n"
            "    return sum(marks[start_index:])\n"
        ),
        "visible_tests": [
            {"id": "v1", "input_args": [[10, 20, 30, 40], 2], "expected_output": 70},
            {"id": "v2", "input_args": [[15, 25, 35], 5], "expected_output": 75},
            {"id": "v3", "input_args": [[], 3], "expected_output": 0},
        ],
        "hidden_tests": [
            {"id": "h1", "input_args": [[5, 10, 15], 3], "expected_output": 30},
            {"id": "h2", "input_args": [[10, 20], 0], "expected_output": 0},
            {"id": "h3", "input_args": [[100], 10], "expected_output": 100},
        ],
        "hints": [
            "Think about what happens when k is larger than the list length.",
            "Use max(0, len(marks) - k) before slicing or looping.",
            "A safe fix is to clamp the start index before summing the end of the list.",
        ],
        "mistake_categories": ["boundary_comparison", "unhandled_short_input"],
        "explanation": {
            "what_happened": "The code computed a negative start index when k was larger than the list length.",
            "where_to_investigate": "Inspect the calculation of start_index before the loop begins.",
            "why_it_matters": "Boundary cases like short input or oversized slices are common sources of crashes.",
            "think_about_this": "If marks has 3 items and k is 5, what should the loop start at?"
        },
    },
    "count-passes": {
        "id": "count-passes",
        "title": "Count Passes",
        "difficulty": "Easy",
        "category": "COMPARISONS & LOOPS",
        "function_name": "count_passes",
        "description": "Count how many marks are at least 40.",
        "concept_tags": ["Lists", "Loops", "Comparisons"],
        "starter_code": (
            "def count_passes(marks):\n"
            "    passes = 0\n"
            "    for mark in marks:\n"
            "        if mark > 40:\n"
            "            passes += 1\n"
            "    return passes\n"
        ),
        "solution_code": (
            "def count_passes(marks):\n"
            "    passes = 0\n"
            "    for mark in marks:\n"
            "        if mark >= 40:\n"
            "            passes += 1\n"
            "    return passes\n"
        ),
        "visible_tests": [
            {"id": "v1", "input_args": [[35, 40, 45, 50]], "expected_output": 3},
            {"id": "v2", "input_args": [[10, 20, 39]], "expected_output": 0},
            {"id": "v3", "input_args": [[40, 40, 40]], "expected_output": 3},
        ],
        "hidden_tests": [
            {"id": "h1", "input_args": [[]], "expected_output": 0},
            {"id": "h2", "input_args": [[100, 100]], "expected_output": 2},
            {"id": "h3", "input_args": [[39, 40]], "expected_output": 1},
        ],
        "hints": [
            "Check whether the threshold includes 40.",
            "The condition should include exactly 40 as a passing mark.",
            "Use >= 40 rather than > 40.",
        ],
        "mistake_categories": ["off_by_one", "boundary_comparison"],
        "explanation": {
            "what_happened": "The logic used > 40 instead of >= 40, so a passing score of 40 was incorrectly excluded.",
            "where_to_investigate": "Inspect the comparison in the if statement inside the loop.",
            "why_it_matters": "Boundary comparisons are easy to get wrong and can systematically exclude valid inputs.",
            "think_about_this": "Should a mark of 40 count as a pass or a fail?"
        },
    },
    "first-n-squares": {
        "id": "first-n-squares",
        "title": "First N Squares",
        "difficulty": "Easy",
        "category": "RANGE & LOOPS",
        "function_name": "first_n_squares",
        "description": "Return the squares of the first n positive integers.",
        "concept_tags": ["Loops", "Range", "Return"],
        "starter_code": (
            "def first_n_squares(n):\n"
            "    squares = []\n"
            "    for i in range(n):\n"
            "        squares.append(i * i)\n"
            "    return squares\n"
        ),
        "solution_code": (
            "def first_n_squares(n):\n"
            "    squares = []\n"
            "    for i in range(1, n + 1):\n"
            "        squares.append(i * i)\n"
            "    return squares\n"
        ),
        "visible_tests": [
            {"id": "v1", "input_args": [3], "expected_output": [1, 4, 9]},
            {"id": "v2", "input_args": [1], "expected_output": [1]},
            {"id": "v3", "input_args": [0], "expected_output": []},
        ],
        "hidden_tests": [
            {"id": "h1", "input_args": [5], "expected_output": [1, 4, 9, 16, 25]},
            {"id": "h2", "input_args": [2], "expected_output": [1, 4]},
            {"id": "h3", "input_args": [10], "expected_output": [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]},
        ],
        "hints": [
            "In Python, range(n) starts at 0, not 1.",
            "Positive integers begin at 1, so you need to start from 1.",
            "Use range(1, n + 1).",
        ],
        "mistake_categories": ["off_by_one"],
        "explanation": {
            "what_happened": "The loop used range(n), which starts at 0 and produces 0, 1, 2 instead of 1, 2, 3.",
            "where_to_investigate": "Inspect the call to range() and the starting value of i.",
            "why_it_matters": "Off-by-one logic often appears when converting natural language ranges into zero-based Python loops.",
            "think_about_this": "Does range(3) include the number 3?"
        },
    },
}


def get_challenge(challenge_id: str):
    challenge = CHALLENGES.get(challenge_id)
    if challenge is None:
        raise KeyError(challenge_id)
    return challenge
