data "archive_file" "dummy" {
  type        = "zip"
  output_path = "${path.module}/lambda_function_payload.zip"

  source {
    content  = "hello"
    filename = "dummy.txt"
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name = "/aws/lambda/microwave"
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "microwave"
  assume_role_policy = file("${path.module}/lambda-policy.json")
}

resource "aws_iam_policy" "policy_for_lambda" {
  name = "microwave"
  path = "/"
  policy = templatefile("${path.module}/lambda-policy.json.tpl", {
    cloudwatch_log_group = aws_cloudwatch_log_group.logs.arn
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.policy_for_lambda.arn
}

resource "aws_lambda_function" "api_lambda" {
  filename      = data.archive_file.dummy.output_path
  function_name = "microwave"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "build/index.handler"

  runtime = "nodejs18.x"

  vpc_config {
    security_group_ids = var.security_groups
    subnet_ids         = var.subnet_ids
  }

  environment {
    variables = {
      DB_URL: "${var.redis_host}:6379"
    }
  }
}

module "trigger" {
  source        = "../trigger"
  region        = "sa-east-1"
  service       = "microwave"
  gateway       = var.gateway
  invoke_arn    = aws_lambda_function.api_lambda.invoke_arn
  function_name = aws_lambda_function.api_lambda.function_name
}
