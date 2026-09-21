variable "run_id" {
  description = "Unique identifier for this state experiment."
  type        = string
}

resource "terraform_data" "remote_state_probe" {
  input = {
    run_id  = var.run_id
    purpose = "prove-s3-remote-state"
  }
}

output "probe" {
  value = terraform_data.remote_state_probe.output
}