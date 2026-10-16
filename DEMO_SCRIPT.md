# Debug Dojo Demo Script

## 5-minute live demo

0:00
- Open the dashboard.
- Say: "Most coding platforms tell you whether your code passed. Debug Dojo focuses on something harder: teaching you why it failed."

0:30
- Open the `last-k-total` challenge.
- Briefly explain the goal: sum the final `k` items while handling short inputs and oversized windows.

1:00
- Submit deliberately buggy code.
- Show the `WRONG OUTPUT` result and explain that the failure is expected and informative.

1:30
- Open the failure investigation panel.
- Walk through the sections: What happened, Where to investigate, Why it matters, and Think about this.

2:00
- Request `Hint 1`, then `Hint 2` if useful.
- Explain that the system coaches reasoning without giving away the answer.

2:40
- Correct the bug and resubmit.
- Show `PASSED` and note the concept that was demonstrated.

3:00
- Open the Debug Replay panel.
- Point out the real recorded sequence: submit, fail, hint, fix, pass.

3:20
- Move to the recurring mistake view.
- Explain: "The system doesn’t just record that I failed; it remembers what kind of mistake I made."

3:45
- Open `Practice This Mistake` and show the targeted next challenge.
- Explain how the recommendation is based on a repeated category and the learner’s current mastery.

4:10
- Show the skills/mastery section.
- Emphasize that progress is based on evidence, not vague completion metrics.

4:30
- Briefly walk through the architecture: React → FastAPI → Restricted Python Runner → Hidden Tests → Sanitized Feedback.

4:45
- Show a hostile snippet being blocked by the sandbox.
- Keep it brief: the important message is that the learner cannot break the host.

5:00
- Close with the core message: "Debug Dojo doesn’t solve the learner’s problem. It teaches the learner how to solve the next one."
