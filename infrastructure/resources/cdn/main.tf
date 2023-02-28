locals {
  zone_id         = "Z03308441EM1ONQR0GRUX"
  certificate_arn = "arn:aws:acm:us-east-1:567645314860:certificate/6a8a6cfe-c632-4ce9-9963-c51d63fd5218"
  domain          = "evshosting.net"
}

module "s3_react" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "microwave-frontend"
  acl    = "private"

  # Allow deletion of non-empty bucket
  force_destroy = true

  attach_elb_log_delivery_policy = true
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "react-app"
}

resource "aws_cloudfront_distribution" "cf_distribution" {
  origin {
    domain_name = module.s3_react.s3_bucket_bucket_regional_domain_name
    origin_id   = "react-origin-d"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "react-origin-d"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  ordered_cache_behavior {
    path_pattern     = "/index.html"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "react-origin-d"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_100"

  aliases = ["*.${local.domain}"]

  viewer_certificate {
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
    acm_certificate_arn      = local.certificate_arn
  }

  retain_on_delete = true

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_route53_record" "domain" {
  zone_id = local.zone_id
  name    = "my-microwave"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cf_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cf_distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

data "aws_iam_policy_document" "react_app_s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.s3_react.s3_bucket_arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "react_app_bucket_policy" {
  bucket = module.s3_react.s3_bucket_id
  policy = data.aws_iam_policy_document.react_app_s3_policy.json
}
