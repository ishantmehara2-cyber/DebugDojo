def test_recurring_mistakes_follow_two_different_challenges_rule(client):
    learner_id = "recurring-learner"

    wrong_cases = [
        ("last-k-total", "def last_k_total(marks, k):\n    return sum(marks[:k])\n"),
        ("count-passes", "def count_passes(marks):\n    return len(marks)\n"),
        ("first-n-squares", "def first_n_squares(n):\n    return [i * i for i in range(n)]\n"),
        ("first-n-squares", "def first_n_squares(n):\n    return [i * i for i in range(n)]\n"),
    ]

    for challenge_id, code in wrong_cases:
        response = client.post("/api/submit", json={"learner_id": learner_id, "challenge_id": challenge_id, "code": code})
        assert response.status_code == 200, response.text
        assert response.json()["overall_status"] == "wrong output"

    learner = client.get(f"/api/learner/{learner_id}")
    body = learner.json()
    assert body["next_challenge"] in {"last-k-total", "count-passes", "first-n-squares"}
    assert body["reason"]
