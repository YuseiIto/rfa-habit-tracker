terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

provider "archive" {}

data "archive_file" "function_source"{
  type = "zip"
  source_dir = "dist"
  output_path = "archive/lambda_function.zip"
}

resource "aws_lambda_function" "function" {
  function_name = "${var.prefix}-function"
  handler = "main.handler"
  role = aws_iam_role.lambda_role.arn
  runtime = "nodejs20.x"

  filename = data.archive_file.function_source.output_path
  source_code_hash = data.archive_file.function_source.output_base64sha256
}

resource "aws_lambda_function_url" "function_url" {
  function_name = aws_lambda_function.function.function_name
  authorization_type = "NONE"
}

output "function_url" {
  value = aws_lambda_function_url.function_url.function_url
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.prefix}-function-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.prefix}-lambda-policy"
  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = [
          aws_cloudwatch_log_group.log_group.arn,
          "${aws_cloudwatch_log_group.log_group.arn}:*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_cloudwatch_log_group" "log_group" {
  name = "/aws/lambda/${aws_lambda_function.function.function_name}"
  retention_in_days = 30
}
