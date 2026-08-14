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

## Temporary AWS environment

The `AWS deployment tests` GitHub Actions workflow creates a temporary Ubuntu
EC2 instance with Terraform, deploys `car-shop-demo` with Docker Compose, waits
for the frontend and API, runs this repository's complete test suite, and then
destroys the instance and security group. The destroy step uses `if: always()`
so it also runs after failed deployments or tests.

Configure these GitHub repository secrets before running the workflow:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `TEST_PASSWORD` (optional; defaults to `TestPassword123!`)

You can optionally define the repository variable `AWS_REGION`; it defaults to
`us-east-1`. The AWS identity needs permission to read the public Ubuntu AMI
parameter from SSM and create, tag, describe, and delete EC2 instances,
security groups, and EBS volumes.

Run the workflow manually from **Actions > AWS deployment tests**, optionally
choosing an application branch or tag. It also runs on pushes to `master`.

Terraform can also be used locally:

```bash
cd terraform
terraform init
terraform apply
terraform output
terraform destroy
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
