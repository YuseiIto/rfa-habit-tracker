variable "prefix" {
  description = "Prefix for the resources"
  type        = string
  default     = "rfa-habit-tracker"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_access_key" {
  description = "AWS access key"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS secret"
  type        = string
  sensitive   = true
}
