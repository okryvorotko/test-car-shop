terraform {
  required_version = ">= 1.6.0"
}

variable "app_version" {
  description = "Application version represented by the QA environment."
  type        = string
  default     = "1.0"
}

resource "terraform_data" "qa_environment" {
  input = {
    environment = "qa-lab"
    app_version = var.app_version
  }
}

output "qa_environment" {
  value = terraform_data.qa_environment.output
}