# Debug Dojo

Debug Dojo is a learning-focused debugging coach that teaches the learner how to reason through the next bug instead of simply giving them the answer. The product is built with React, TypeScript, Vite, Tailwind CSS, Motion, Lucide, React Router, Zustand, FastAPI, and a restricted Python runner.

## What problem does it solve?

Most coding platforms tell the learner whether their code passed. Debug Dojo focuses on the harder and more useful part: teaching why it failed, where to investigate, and how the mistake becomes a pattern to practice.

## How it works

1. The learner opens a challenge.
2. They inspect the brief and the starter code.
3. They submit a solution to the judge.
4. The system classifies the result as `passed`, `wrong output`, `runtime error`, or `timeout`.
5. The learner receives a plain-language explanation and a targeted hint flow.
6. Recurring patterns are tracked and used to recommend the next challenge.

## Run locally

```sh
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:8000`.

If you want to run them separately:

```sh
npm run dev:frontend
npm run dev:backend
```

## Architecture

- React client for the learner experience
- FastAPI API for challenge submission and hints
- Restricted Python runner for execution isolation
- Browser-side bounded feedback for the complete frontend challenge catalog
- Deterministic mistake detection and mastery tracking

## Security model

- The FastAPI runner uses a subprocess with a timeout and caps captured output.
- The current all-challenge UI evaluator runs in a terminable Web Worker with a time limit and output-size cap; this is a responsiveness safeguard, not a secure sandbox.
- The FastAPI catalog currently supports `last-k-total`, `count-passes`, and `first-n-squares`; the wider frontend catalog is not yet routed through that API.
- Hidden-test values are not rendered by the UI or returned by the browser evaluator, but the current frontend catalog still ships its test data to the client. Move the full catalog and evaluation to the backend before treating tests as confidential in production.

## Challenge system

The project includes judge-focused coding problems such as:

- `last-k-total`
- `count-passes`
- `first-n-squares`

Each challenge provides visible tests, hidden tests, progressive hints, explanations, and a mistake category.

## Mistake taxonomy

The learning loop tracks categories including:

- `off_by_one`
- `unhandled_short_input`
- `print_not_return`
- `boundary_comparison`
- `mutates_input`

## Hint system

Hints are intentionally limited and coaching-oriented. The system stops after the designed hint set and provides a no-more-hints message instead of exposing a solution.

## API

- `POST /api/submit` — submit learner code for challenge evaluation
- `POST /api/hint` — request the next clue for a challenge
- `GET /api/learner/{learner_id}` — fetch the next challenge recommendation and current mastery
- `GET /api/health` — backend health check

## Testing

```sh
pytest
npm run lint
npm run build
```

The judge harness lives under `backend/tests/judge` and covers outcome classification, hint leakage, recurring mistakes, mastery, API contract, and sandbox red-team protection.

## Demo instructions

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for a five-minute live demo flow.

## Source layout

- `src/components/` — shared UI, Sensei, and navigation
- `src/data/` — challenge definitions and catalog data
- `src/pages/` — route-level page components
- `src/store/` — persisted learner state and challenge logic
- `backend/app/` — FastAPI backend and sandbox runner
- `backend/tests/judge/` — security and judge test pack
