variable "aws_region" {
  description = "AWS region in which to run the temporary test server."
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type for the application."
  type        = string
  default     = "t3.micro"
}

variable "app_repository" {
  description = "Public Git repository containing car-shop-demo."
  type        = string
  default     = "https://github.com/okryvorotko/car-shop-demo.git"
}

variable "app_ref" {
  description = "Branch or tag of the application to deploy."
  type        = string
  default     = "master"

  validation {
    condition     = can(regex("^[A-Za-z0-9._/-]+$", var.app_ref))
    error_message = "app_ref may contain only letters, digits, dots, underscores, slashes, and hyphens."
  }
}

variable "run_id" {
  description = "Unique CI run identifier used in resource names and tags."
  type        = string
  default     = "local"

  validation {
    condition     = can(regex("^[A-Za-z0-9._-]+$", var.run_id))
    error_message = "run_id may contain only letters, digits, dots, underscores, and hyphens."
  }
}

variable "allowed_cidr" {
  description = "IPv4 CIDR allowed to reach the QA application."
  type        = string

  validation {
    condition     = can(cidrnetmask(var.allowed_cidr))
    error_message = "allowed_cidr must be valid IPv4 CIDR notation."
  }
}

variable "expires_at" {
  description = "UTC expiration timestamp used by orphan cleanup automation."
  type        = string
}

