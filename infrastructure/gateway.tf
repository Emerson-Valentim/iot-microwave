locals {
  zone_id         = "Z03308441EM1ONQR0GRUX"
  certificate_arn = "arn:aws:acm:sa-east-1:567645314860:certificate/4779508e-f277-4713-a78b-98aaff59379b"
  domain          = "evshosting.net"
}

resource "aws_api_gateway_rest_api" "main" {
  name = "microwave"
}

resource "aws_api_gateway_domain_name" "main" {
  domain_name              = "microwave.${local.domain}"
  regional_certificate_arn = local.certificate_arn
  security_policy          = "TLS_1_2"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_route53_record" "main" {
  name    = "${aws_api_gateway_domain_name.main.domain_name}"
  type    = "A"
  zone_id = local.zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.main.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.main.regional_zone_id
  }
}
