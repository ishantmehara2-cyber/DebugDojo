def test_red_team_attempts_are_blocked_or_safe(client):
    hostile_payloads = [
        ("count-passes", "import socket\n\ntry:\n    socket.create_connection(('127.0.0.1', 8000))\nexcept Exception:\n    pass\n\n\ndef count_passes(marks):\n    return sum(1 for mark in marks if mark >= 40)\n"),
        ("count-passes", "try:\n    with open('/etc/passwd') as handle:\n        _ = handle.read()\nexcept Exception:\n    pass\n\ndef count_passes(marks):\n    return sum(1 for mark in marks if mark >= 40)\n"),
        ("count-passes", "import os\nprint(dict(os.environ))\ndef count_passes(marks):\n    return sum(1 for mark in marks if mark >= 40)\n"),
        ("count-passes", "import subprocess\nsubprocess.run(['echo', 'hi'])\ndef count_passes(marks):\n    return sum(1 for mark in marks if mark >= 40)\n"),
        ("count-passes", "x = []\nwhile True:\n    x.append('A' * 1000000)\n\ndef count_passes(marks):\n    return sum(1 for mark in marks if mark >= 40)\n"),
    ]

    for challenge_id, code in hostile_payloads:
        response = client.post("/api/submit", json={"learner_id": "redteam", "challenge_id": challenge_id, "code": code})
        assert response.status_code == 200
        body = response.json()
        status = body["overall_status"]
        assert status in {"runtime error", "wrong output", "timeout"}, body
        assert "traceback" not in str(body).lower()

    health = client.get("/api/health")
    assert health.json() == {"status": "ok"}
