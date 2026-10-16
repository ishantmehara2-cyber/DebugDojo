# Architecture

```
                    ┌──────────────────┐
                    │   React Client   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    FastAPI API   │
                    └────────┬─────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
        ┌──────────────────┐   ┌──────────────────┐
        │ Submission       │   │ Learning Engine  │
        │ Manager          │   │                  │
        └────────┬─────────┘   └──────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Restricted       │
        │ Python Runner    │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Visible + Hidden │
        │ Tests            │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Result + Mistake │
        │ Detection        │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Sanitized Coach  │
        │ Feedback         │
        └──────────────────┘
```

## Components

### React Client
- Renders challenge pages, dashboards, skills, bug diary, and sensei coaching states.
- Keeps the UX polished and consistent while focusing on debugging pedagogy.

### FastAPI API
- Accepts learner submissions and hint requests.
- Validates challenge IDs and payload shape before executing anything.
- Returns safe result payloads with no raw traceback leakage.

### Submission Manager
- Looks up the requested challenge.
- Sends the learner code to the isolated runner.
- Classifies outcomes into `passed`, `wrong output`, `runtime error`, and `timeout`.

### Restricted Python Runner
- Executes learner code in a sanitized environment.
- Disables dangerous modules and restricts file access.
- Caps execution time and output size to protect the host.

### Visible + Hidden Tests
- Visible tests supply immediate feedback to the learner.
- Hidden tests remain server-side, isolated from the learner UI, and used for deeper validation.

### Result + Mistake Detection
- Compares actual outputs to expected values.
- Maps failures to the relevant mistake category and recurring-pattern tracking.

### Sanitized Coach Feedback
- Produces plain-language explanations with four structured sections.
- Feeds the next challenge recommendation and the mastery model.
