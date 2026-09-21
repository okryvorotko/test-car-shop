terraform {
  required_version = ">= 1.10.0"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "test-car-shop"
      ManagedBy   = "terraform"
      RunId       = var.run_id
      Environment = "ephemeral-qa"
      Owner       = "qa-automation-lab"
      ExpiresAt   = var.expires_at
    }
  }
}
