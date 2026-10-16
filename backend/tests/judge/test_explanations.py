def test_explanations_cover_required_sections(client):
    failure_cases = [
        ("count-passes", "def count_passes(marks):\n    return len(marks)\n"),
        ("last-k-total", "def last_k_total(marks, k):\n    return sum(marks[:k])\n"),
        ("first-n-squares", "def first_n_squares(n):\n    return [i * i for i in range(n)]\n"),
        ("count-passes", "def count_passes(marks):\n    return 0\n"),
        ("last-k-total", "def last_k_total(marks, k):\n    return 0\n"),
    ]

    for challenge_id, code in failure_cases:
        response = client.post("/api/submit", json={"learner_id": "explain-check", "challenge_id": challenge_id, "code": code})
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["overall_status"] == "wrong output"
        explanation = body["explanation"]
        for key in [
            "WHAT HAPPENED",
            "WHERE TO INVESTIGATE",
            "WHY IT MATTERS",
            "THINK ABOUT THIS",
        ]:
            assert key in explanation
            assert explanation[key]
