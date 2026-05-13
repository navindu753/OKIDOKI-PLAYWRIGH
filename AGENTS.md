# AGENTS.md

## Cursor Cloud specific instructions

This is a **Playwright E2E test suite** (not an application). There is no local server to start — all tests run against the remote OkiDoki dev instance at `http://okidokidev.overleap.lk`.

### Running tests

- `npm test` runs `playwright test` across all configured projects (Chromium, Firefox, WebKit).
- To run a specific test file: `npx playwright test <path> --project=chromium`
- Working test files: `tests/example.spec.ts`, `tests/seed.spec.ts`, `e2e/tests/login.spec.js`

### Known issues in the repo

- `e2e/tests/job_request.spec.js` imports a missing fixture (`fixtures/credentials_okidoki`). It will fail at import time.
- `e2e/tests/login negative.spec.js` does not import `test` from `@playwright/test`. It will fail at parse time.
- `e2e/tests/login positive.spec.js` and `e2e/tests/auto_generate.spec.js` target `example.com` placeholder URLs — they are template/scaffold tests.

### Credentials

- Several tests require `OKIDOKI_EMAIL` and `OKIDOKI_PASSWORD` env vars to run authenticated tests against the OkiDoki dev instance. Without these, those tests are skipped.
- `e2e/tests/auto_generate.spec.js` uses `TEST_EMAIL` / `TEST_PASSWORD` env vars.

### No lint/type-check configured

The repo has no ESLint, Prettier, or TypeScript config files. The only runnable check is `npm test`.

### Viewing test reports

After running tests, view the HTML report with `npx playwright show-report`. Do not run `npm test` with all specs — `job_request.spec.js` and `login negative.spec.js` will crash the runner due to pre-existing import errors. Instead, run specific working test files listed above.
