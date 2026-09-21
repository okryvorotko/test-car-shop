# Terraform environment

This directory contains the deployable, short-lived AWS environment used by
the manual `AWS deployment tests` workflow. It also contains isolated
curriculum exercises; those directories are not loaded by the root module.

## Directory boundaries

| Path | Purpose |
| --- | --- |
| `terraform/` | EC2-based application environment used by the test workflow |
| `terraform/bootstrap-state/` | One-time creation of the versioned S3 state bucket |
| `terraform/terraform-labs/` | Isolated lifecycle curriculum exercise |
| `terraform/remote-state-smoke/` | Remote-state writer exercise |
| `terraform/remote-state-smoke-reader/` | Independent remote-state reader exercise |

The root module requires Terraform 1.10 or newer because CI uses native S3
state locking with `use_lockfile=true`.

## One-time state bootstrap

Authenticate to the intended AWS account, then create the state bucket once:

```bash
terraform -chdir=terraform/bootstrap-state init
terraform -chdir=terraform/bootstrap-state apply
terraform -chdir=terraform/bootstrap-state output -raw state_bucket_name
```

The bucket has versioning, encryption, blocked public access, and a policy that
requires TLS. `prevent_destroy` protects it from accidental deletion.

Add the output value as the GitHub repository variable `TF_STATE_BUCKET`.
`TF_STATE_REGION` is optional and defaults to `us-east-1`. The application
region can be set independently with the optional `AWS_REGION` variable.

The workflow also requires `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
repository secrets. `TEST_PASSWORD` is optional and is used only for generated
demo users. The AWS identity needs access to the state bucket and permission to
read the Ubuntu AMI parameter from SSM and manage the temporary EC2 instance,
security group, and EBS volume. Native lock files require object read, write,
and delete permission for the `.tflock` key.

## CI lifecycle

For each manually triggered run, the workflow:

1. Creates a run-specific S3 state key and lock file.
2. Detects the GitHub runner's public IPv4 address.
3. Restricts ports 3000 and 4000 to that single `/32` address.
4. Tags resources with the run ID and a four-hour expiry timestamp.
5. Deploys the application, waits for health checks, and runs API and UI tests
   on the same runner.
6. Executes `terraform destroy` through an `if: always()` cleanup path.

Keeping deployment and testing on one runner makes the security-group rule
predictable and avoids opening the demo application to the public internet.
The remote state remains available if a hosted runner is interrupted, allowing
the same run key to be inspected or cleaned up manually.

## Cost and cleanup

The workflow is manual because it creates billable AWS resources. Review the
plan before experimenting locally, and always destroy the root module when the
exercise is complete. The expiry tag is a recovery aid; it is not a substitute
for the workflow's teardown step.
