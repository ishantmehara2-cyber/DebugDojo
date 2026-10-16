def test_api_contract_and_error_handling(client):
    bad_submit = client.post("/api/submit", json={"learner_id": "a", "challenge_id": "count-passes"})
    assert bad_submit.status_code == 422

    good_submit = client.post(
        "/api/submit",
        json={
            "learner_id": "api-check",
            "challenge_id": "count-passes",
            "code": "def count_passes(marks):\n    return sum(1 for mark in marks if mark >= 40)\n",
        },
    )
    assert good_submit.status_code == 200
    assert good_submit.json()["overall_status"] == "passed"

    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json() == {"status": "ok"}

    learner = client.get("/api/learner/api-check")
    assert learner.status_code == 200
    assert learner.json()["learner_id"] == "api-check"
