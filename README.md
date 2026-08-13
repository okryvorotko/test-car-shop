# test-car-shop

Standalone API and UI automation framework for `car-shop-demo`.

## Stack

- API tests: Node.js, Mocha, and built-in `fetch`
- UI tests: Playwright
- Shared entities: users, cars, cart, and orders through fixtures and API helpers
- Cleanup: `/admin/reset` runs after each test

## Setup

1. Start `car-shop-demo` backend at `http://localhost:4000`.
2. Start `car-shop-demo` frontend at `http://localhost:3000`.
3. Copy `.env.example` to `.env` if your ports differ.
4. Install dependencies:

```bash
npm install
npx playwright install
```

## Run

```bash
npm run test:api
npm run test:ui
npm test
```

## Project Layout

```text
src/api       API clients and cleanup helpers
src/data      Reusable car catalog expectations
src/fixtures  User and test data factories
src/ui        Reusable Playwright page objects
tests/api     Mocha API specs
tests/ui      Playwright UI specs
```
