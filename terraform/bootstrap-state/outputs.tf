output "state_bucket_name" {
  description = "Name of the S3 bucket used for Terraform state."
  value       = aws_s3_bucket.terraform_state.id
}

output "application_state_key_example" {
  description = "Example remote-state key for the application."
  value       = "test-car-shop/environments/example/terraform.tfstate"
}