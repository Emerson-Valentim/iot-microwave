terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.56.0"
    }
  }
}

variable "region" {
  default = "sa-east-1"
}

provider "aws" {
  region     = var.region
  profile    = "default"
}

module "server" {
  source = "./resources/lambda"
  gateway = {
    id               = aws_api_gateway_rest_api.main.id
    root_resource_id = aws_api_gateway_rest_api.main.root_resource_id
    execution_arn    = aws_api_gateway_rest_api.main.execution_arn
    domain_name      = aws_api_gateway_domain_name.main.domain_name
  }
  security_groups = [aws_security_group.server.id]
  subnet_ids      = module.vpc.private_subnets
  redis_host      = aws_elasticache_replication_group.redis.primary_endpoint_address
}

module "frontend" {
  source = "./resources/cdn"
}
