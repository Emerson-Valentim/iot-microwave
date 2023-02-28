resource "aws_elasticache_replication_group" "redis" {
  description                = "redis for storage"
  replication_group_id       = "redis"
  automatic_failover_enabled = false
  engine                     = "redis"
  node_type                  = "cache.t2.micro"
  num_cache_clusters         = 1
  port                       = 6379
  subnet_group_name          = module.vpc.elasticache_subnet_group_name
  security_group_ids         = [aws_security_group.redis.id]
  apply_immediately          = true
}