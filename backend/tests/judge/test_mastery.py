def test_mastery_bounds_and_progression(client):
    challenge_id = "count-passes"
    learner_id = "mastery-check"

    response = client.post(
        "/api/submit",
        json={
            "learner_id": learner_id,
            "challenge_id": challenge_id,
            "code": "def count_passes(marks):\n    return sum(1 for mark in marks if mark >= 40)\n",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["overall_status"] == "passed"

    learner = client.get(f"/api/learner/{learner_id}")
    mastery = learner.json()["mastery"]
    if mastery:
        for value in mastery.values():
            assert 0 <= value <= 100
    assert "Loops" in str(mastery)
