# Saucedemo Playwright Example

An example of what an AI-driven Playwright pipeline produces from a single URL. The pipeline explored https://www.saucedemo.com (a public demo store), designed 30 test cases from what it saw, generated the code in this repository, and ran it. This branch contains only the generated Playwright project.

## Result

- 35 tests per browser (Chromium, Firefox, WebKit), plus one login setup test: 106 tests in total.
- All 106 passed on the first full run with retries off.
- A repeat run of the Chromium tests (5 times, retries off) passed 176 of 176.
- No application bug was found.

## Run it

Requires Node.js 22 or later.

```bash
npm ci
npx playwright install
cp .env.example .env        # PowerShell: Copy-Item .env.example .env
```

Fill in `TEST_USER` and `TEST_PASSWORD` in `.env`. The saucedemo login page lists the demo username and the shared password.

```bash
npm test                              # all browsers
npx playwright test --project=chromium
npx playwright test --grep @smoke     # main flows only
npm run test:report                   # open the HTML report
npm run verify                        # typecheck, lint, list tests
```

If tests go to the wrong host, a variable set in your shell is overriding `.env`. The run prints a `[config]` warning naming it. Clear it with `Remove-Item Env:BASE_URL` in PowerShell.

## What is covered

| File | Tests | Covers |
|------|-------|--------|
| `tests/authentication.spec.ts` | 10 | Login, the four error messages, dismissing an error, redirect from 3 protected pages, logout |
| `tests/inventory.spec.ts` | 9 | Product list, 3 sort orders, add and remove, product detail |
| `tests/cart.spec.ts` | 4 | Cart contents, remove, continue shopping, empty cart |
| `tests/checkout.spec.ts` | 7 | Required-field messages, cancel on both pages, totals, completing an order |
| `tests/menu.spec.ts` | 5 | Menu options, Reset App State, the three Dynamic Catalog pages |

Not covered: the other demo users (problem_user, performance_glitch_user and so on), the behavior of the Dynamic Catalog pages beyond opening them, an unknown product id, accessibility, mobile and performance.

## Layout

```
playwright.config.ts          # baseURL from .env, 3 browsers, traces/screenshots/video kept on failure
tests/
  fixtures.ts                 # one fixture per page object; specs import test/expect from here
  auth.setup.ts               # logs in once and saves the session for all other tests
  pages/                      # one page object per page, all locators live here
  support/                    # env helper, test data, paths
  *.spec.ts
```

## How the code is written

- Every locator is in a page object. Specs call page-object methods and assert on the locators they return.
- Locators use role and accessible name first, then the site's `data-test` ids (set with `testIdAttribute` in the config). No XPath and no CSS selectors.
- Assertions retry (`await expect(locator)...`). There are no fixed sleeps, `networkidle` waits or forced clicks.
- Login happens once in `tests/auth.setup.ts`. Each test starts from that saved session and builds its own cart, so tests do not depend on each other.
- Each test has a priority tag (`@priority-high`, ...), main flows also have `@smoke`, and each carries a `groundedIn` annotation. Those annotations point to sections of the pipeline's site map, which is not included in this branch.
- Test data comes from values seen during exploration, kept in `tests/support/data.ts`.
- `npm run verify` runs `tsc` in strict mode and ESLint (typescript-eslint and eslint-plugin-playwright) with zero warnings allowed.

## Secrets

`.env` and the saved session in `playwright/.auth/` are git-ignored. `.env.example` has variable names only.
