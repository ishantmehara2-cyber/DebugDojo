def test_hint_service_stays_within_policy(client):
    challenge_id = "count-passes"
    learner_id = "hint-check"

    for idx in range(3):
        response = client.post("/api/hint", json={"learner_id": learner_id, "challenge_id": challenge_id, "hint_index": idx})
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["exhausted"] is False
        assert "def " not in body["hint"].lower()
        assert "return " not in body["hint"].lower()

    response = client.post("/api/hint", json={"learner_id": learner_id, "challenge_id": challenge_id, "hint_index": 3})
    assert response.status_code == 200
    body = response.json()
    assert body["exhausted"] is True
    assert "No additional hints" in body["hint"]
