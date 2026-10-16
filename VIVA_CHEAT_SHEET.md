# Viva Cheat Sheet

## 1. Why not just use ChatGPT?
- ChatGPT can generate answers, but it does not teach the learner to reason through the bug.
- Debug Dojo focuses on diagnosis, reflected practice, and pattern detection across attempts.

## 2. Why are hints better than answers?
- Hints preserve the cognitive struggle needed for learning.
- The system gives direction without replacing the learner’s thinking.

## 3. How are hidden tests protected?
- Hidden tests live on the backend, never in the learner-facing UI.
- The response schema exposes only safe summaries, not raw inputs or expected values.

## 4. Why can't learner code run inside FastAPI?
- The server should be a control plane, not an execution host.
- Learner code is run in a restricted, isolated environment to avoid privilege escalation and host compromise.

## 5. How do you stop infinite loops?
- Each execution runs under a bounded timeout. The runner terminates the process and returns a timeout status.

## 6. How do you stop memory attacks?
- The sandbox enforces a modest memory and output budget and terminates runaway allocations.

## 7. How do you stop network access?
- The runner blocks dangerous imports and uses a sanitized environment so learner code cannot reach localhost or external hosts.

## 8. How do you stop filesystem access?
- The runner avoids direct file APIs and isolates the working directory so protected files remain out of reach.

## 9. How do you detect recurring mistakes?
- The system records mistake categories tied to challenge IDs and detects when the same category appears in two different challenges.

## 10. Why use deterministic detection instead of AI?
- Deterministic checks are transparent, auditable, and predictable for a judge.
- They do not hallucinate explanations or invent hidden data.

## 11. How does mastery work?
- Mastery is updated based on success and hint usage.
- Independent success contributes more than hint-assisted success, and values stay bounded from 0 to 100.

## 12. How does hint-assisted success differ from independent success?
- Independent success is stronger evidence of mastery.
- Hint-assisted success still helps the learner progress, but it contributes less to mastery than solving without hints.

## 13. How does the system choose the next challenge?
- It prioritizes recurring mistakes that still need practice.
- If none exist, it selects the lowest-confidence concept to target next.

## 14. How do you prevent hint leakage?
- Hints are finite, coaching-oriented, and never reveal complete solutions.
- The system stops after the designed hint set and provides an exhaustion message.

## 15. What happens when the sandbox is attacked?
- The submission is classified as a safe failure and the server remains healthy.
- The attack is contained; the product continues to function.

## 16. Why is Sensei different from a chatbot?
- Sensei plays a coaching role: it nudges the learner toward reasoning, not answers.
- It is tied to evidence from the attempt, challenge context, and recurring pitfalls.

## 17. How could this scale?
- Multiple isolated runner workers, a persistent database, and a queue for evaluation would allow larger scale while keeping challenge isolation strict.

## 18. What would you improve with more time?
- More challenge families, richer mastery analytics, and stronger per-learner replay history would be the next obvious enhancements.
