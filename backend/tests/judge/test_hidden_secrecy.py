def test_hidden_values_are_not_exposed(client):
    response = client.post(
        "/api/submit",
        json={
            "learner_id": "safe-check",
            "challenge_id": "count-passes",
            "code": "def count_passes(marks):\n    return len(marks)\n",
        },
    )
    body = response.json()
    assert response.status_code == 200
    assert body["overall_status"] == "wrong output"
    assert "hidden" not in str(body).lower()
    assert "traceback" not in str(body).lower()
    assert "python" not in str(body).lower()

    learner = client.get("/api/learner/safe-check")
    assert learner.status_code == 200
    next_challenge = learner.json().get("next_challenge")
    assert next_challenge in {"last-k-total", "count-passes", "first-n-squares"}
