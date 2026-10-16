# Mistake Taxonomy

## off_by_one
- Definition: the learner includes or excludes the wrong boundary value.
- Detection signal: wrong output on exact edge values or list bounds.
- Example symptom: `range(1, n)` instead of `range(1, n + 1)`.
- Example challenge: `first-n-squares`.
- Recurring pattern: appears across different challenges when the learner repeatedly mishandles exact boundaries.
- Practice target: short-input and edge-value review.

## unhandled_short_input
- Definition: the learner assumes a list or value is always long enough.
- Detection signal: failure on empty lists, short arrays, or oversized k values.
- Example symptom: negative index or missing return guard.
- Example challenge: `last-k-total`.
- Recurring pattern: repeated handling failures on tiny or empty input sets.
- Practice target: build a short-input safety check before iteration.

## print_not_return
- Definition: the code prints a value instead of returning it to the caller.
- Detection signal: function result stays `None` or mismatches call contract.
- Example symptom: `print(num)` instead of `return num`.
- Example challenge: `first-even`.
- Recurring pattern: reappears when a learner confuses output formatting with function behavior.
- Practice target: deliberately trace the contract from caller to function return.

## boundary_comparison
- Definition: the learner uses the wrong comparison against a threshold.
- Detection signal: failure on exact boundary values such as 40 or 0.
- Example symptom: `mark > 40` instead of `mark >= 40`.
- Example challenge: `count-passes`.
- Recurring pattern: occurs when the learner repeatedly misinterprets inclusive vs exclusive comparisons.
- Practice target: review the exact rule and run a boundary-value test.

## mutates_input
- Definition: the learner modifies the original data structure instead of returning a transformed copy.
- Detection signal: unexpected side effects or input changes after execution.
- Example symptom: list is edited in place instead of a new list being built.
- Example challenge: `double-positives`.
- Recurring pattern: reappears when the learner ignores immutability requirements.
- Practice target: separate input validation from returned transformation logic.
