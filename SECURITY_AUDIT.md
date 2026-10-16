# Security Audit

## Summary

The Debug Dojo backend is a FastAPI judge service that executes learner Python in a contained subprocess. The enforcement model combines a restricted runner, a deny-list for dangerous modules, and bounded execution limits. This audit covers network escape, filesystem access, secret exposure, process abuse, output floods, and hidden-test leakage.

## Categories

### Network
- Attack: learner code attempted socket and HTTP access to localhost.
- Expected: sandbox should block external reachability.
- Actual: blocked via import restrictions and a subprocess guard.
- Status: PASS
- Fix: deny dangerous imports and run submissions in a temporary directory with a minimal environment.

### Filesystem
- Attack: learner code attempted to open protected system files.
- Expected: host files stay inaccessible.
- Actual: file access is blocked by the restricted builtins and the sandboxed working directory.
- Status: PASS
- Fix: remove direct file APIs from the execution namespace and isolate the working directory.

### Secrets
- Attack: learner code attempted to read environment variables.
- Expected: no secrets are exposed to the learner.
- Actual: the environment is sanitized, and only a minimal path is provided.
- Status: PASS
- Fix: clear Python path and env variables, and prevent direct access to os.environ.

### Processes
- Attack: code attempted subprocess creation and process abuse.
- Expected: no process escape or host takeover.
- Actual: blocked by import restrictions and the execution timeout guard.
- Status: PASS
- Fix: deny dangerous modules and enforce subprocess timeout and output limits.

### Memory / CPU / Output
- Attack: infinite loops and massive allocations were attempted.
- Expected: execution is bounded and returns a safe error.
- Actual: timeouts and output caps terminate the run before server instability.
- Status: PASS
- Fix: run each submission with a bounded timeout and limit stdout/stderr size.

### Hidden tests
- Attack: adversarial submissions attempted to discover hidden data or internal details.
- Expected: hidden values and traces must never reach the learner.
- Actual: API responses return safe result labels and high-level explanation text, never internal tracebacks or challenge secrets.
- Status: PASS
- Fix: sanitize runtime-error detail fields and keep hidden test data server-side only.

### API / Concurrency
- Attack: malformed and hostile requests were sent.
- Expected: errors should be clean HTTP failures without crashing FastAPI.
- Actual: validation prevents malformed payloads and sandbox violations remain contained.
- Status: PASS
- Fix: keep request validation and controlled error handling in the API layer.

## Final status

The sandbox is not a full OS-level container escape-proof system, but it is hardened to the current project scope and passes the judge/security suite in this environment.
