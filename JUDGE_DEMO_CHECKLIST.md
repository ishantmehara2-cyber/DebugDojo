# Judge Demo Checklist

## 5-minute Demo Flow

0:00 — Dashboard story
- Open the dashboard and explain the learning loop.
- Highlight the current mission and the learning focus.
- State that the system is tracking repeated mistakes and skill growth, not just challenge completion.

0:30 — Open last-k-total
- Navigate to `/challenge/last-k-total`.
- Read the challenge brief and function contract.
- Point out the key boundary condition in the starter code.

1:20 — Failure + per-test outcomes
- Run the starter solution.
- Show the visible tests and explain which cases fail.
- Call out the semantic result states: PASS, WRONG OUTPUT, RUNTIME ERROR, TIMEOUT.
- Explain that hidden tests remain protected and summarized, not exposed to the learner.

2:00 — Why Did I Fail
- Review the failure explanation for `WHAT HAPPENED`, `WHERE TO INVESTIGATE`, `WHY IT MATTERS`, and `THINK ABOUT THIS`.
- Emphasize that the failure teaches the learner what to investigate next.

2:20 — Progressive hints
- Reveal Hint 1.
- Reveal Hint 2.
- Reveal Hint 3.
- Confirm that the hints still require the learner to reason through the fix and write the final code.

3:00 — Fix + pass
- Update the function to handle short/empty input and clamped indexing.
- Run the code again.
- Show successful pass state and hidden test summary without exposing hidden values.

3:30 — Debug Replay
- Open Debug Replay.
- Explain the actual trial flow: submission, failure, mistake detection, Sensei guidance, hint use, updated code, and pass.

4:00 — Recurring mistake
- Trigger a second challenge that repeats the same mistake category.
- Show the recurring pattern banner and the `PATTERN DETECTED` state.
- Explain the requirement that recurrence requires the same category in two different challenges.

4:20 — Targeted challenge
- Click `PRACTICE THIS MISTAKE →`.
- Show the targeted challenge list and the reason tied to the recurring mistake.

4:40 — Architecture / security
- State clearly that this Phase 2 frontend is local-only mock execution.
- Explain that Phase 3 will replace it with a server-side submission path and restricted execution model.
- Emphasize that hidden tests live server-side and are not shipped to the client.

5:00 — Closing statement
- Say: “Debug Dojo doesn't solve the learner's problem. It teaches the learner how to solve the next one.”

## Required Judge Narrative

The demonstration should feel like a real debugging coach, not a generic coding challenge site. The learning loop is the product: observe failure, classify it, notice recurrence, practice the mistake, build mastery, and receive a targeted next challenge.

## Demo QA Checklist

- [ ] Dashboard loads and presents a clear current mission.
- [ ] Last-k Total challenge opens and the contract is readable.
- [ ] Failure state shows PASS / WRONG OUTPUT / RUNTIME ERROR / TIMEOUT semantics as required.
- [ ] Why Did I Fail section is visible and specific.
- [ ] Hint 1/2/3 can be revealed progressively.
- [ ] The code can be fixed and successfully passed.
- [ ] Debug Replay reflects real events.
- [ ] Recurring mistake becomes visible only after two different challenges.
- [ ] Practice page opens to the relevant mistake category.
- [ ] The recommended challenge includes a reason.
- [ ] The architecture note explicitly distinguishes frontend demo from secure backend implementation.
