# Judge Test Report

## Summary

Status: PASS

The judge suite covers outcome classification, hidden-test secrecy, hint leakage, recurring mistakes, mastery, explanation quality, API contract checks, and sandbox red-team resilience.

## Category coverage

| Category | Result | Count |
|---|---|---:|
| Outcome classification | PASS | 12 |
| Hidden secrecy | PASS | 1 |
| Hint leakage | PASS | 1 |
| Recurring mistakes | PASS | 1 |
| Explanations | PASS | 1 |
| API contract | PASS | 1 |
| Mastery | PASS | 1 |
| Sandbox red-team | PASS | 1 |

## Outcome classification
- Valid submissions are classified as `passed`.
- Wrong outputs are classified as `wrong output`.
- Runtime crashing code is classified as `runtime error`.
- Infinite loops are classified as `timeout`.

## Hidden secrecy
- Hidden values are never included in the learner-facing response.
- Error payloads do not leak traceback details or internal file paths.

## Hint leakage
- Progressive hints remain coaching-oriented.
- A fourth hint returns a safe no-more-hints message instead of revealing a solution.

## Recurring mistakes
- The recurring-mistake logic is enforced by tracking distinct challenge IDs per category.
- Same mistake repeated on the same challenge does not escalate into a recurring pattern.

## Mastery
- Successes update mastery values deterministically.
- Values remain bounded between 0 and 100.

## API contract
- Required fields are enforced.
- Unknown challenges return safe HTTP errors.
- Health checks remain available after hostile runs.

## Sandbox resilience
- Dangerous import attempts and filesystem access are blocked.
- Infinite loops and huge memory patterns are bounded by timeout and output limits.
