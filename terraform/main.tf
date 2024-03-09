terraform {
  backend "local" {
    path = "terraform.tfstate"
  }

  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 7.14.1"
    }
  }
}

provider "google" {
  project = "experiment-signed-urls"
  region  = "us-east1"
  zone    = "us-east1-c"
}

resource "google_storage_bucket" "cv-uploads" {
  name          = "experiment-signed-urls-file-bucket"
  location      = "US-EAST1"
  force_destroy = true

  cors {
    origin          = ["http://localhost:3000"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["Content-Type", "access-control-allow-origin"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }

    condition {
      age = 2
    }
  }
}
