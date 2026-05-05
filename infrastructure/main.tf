provider "aws" {
  region = "eu-central-1"
}

# 1. VPC Configuration
resource "aws_vpc" "healthhub_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "Healthhub-VPC"
  }
}

# 2. RDS MySQL Database
resource "aws_db_instance" "default" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name                 = "healthhub_db"
  username             = "root"
  password             = "supersecretpassword123" # In production, pull this from Vault
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
}

# 3. EKS Cluster (Kubernetes)
resource "aws_eks_cluster" "healthhub_eks" {
  name     = "healthhub-cluster"
  role_arn = "arn:aws:iam::123456789012:role/EKS-Role"

  vpc_config {
    subnet_ids = ["subnet-12345", "subnet-67890"]
  }
}

output "database_endpoint" {
  value = aws_db_instance.default.endpoint
}
output "eks_cluster_name" {
  value = aws_eks_cluster.healthhub_eks.name
}
