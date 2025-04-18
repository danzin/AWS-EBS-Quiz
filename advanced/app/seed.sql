CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the tables
CREATE TABLE public.answers (
  uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_uuid UUID NOT NULL,
  choice CHAR(1) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp NOT NULL
);

CREATE TABLE public.questions (
    uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL
);

-- Seed data for questions
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option) VALUES
('Which service is used for hosting websites?', 'Amazon RDS', 'Amazon S3', 'Amazon Lambda', 'Amazon DynamoDB', 'B'),
('What does AWS IAM stand for?', 'Identity and Access Management', 'Internet Application Manager', 'Infrastructure Automation Module', 'Instance Access Management', 'A'),
('Which service is used for monitoring AWS resources?', 'Amazon CloudWatch', 'Amazon ElastiCache', 'AWS Fargate', 'Amazon Redshift', 'A'),
('What is the default storage class in S3?', 'Intelligent-Tiering', 'One Zone-IA', 'Standard', 'Glacier', 'C'),
('Which AWS service is best for serverless computing?', 'AWS Lambda', 'Amazon EC2', 'Amazon RDS', 'Amazon Aurora', 'A'),
('Which service allows decoupling of applications?', 'Amazon SNS', 'Amazon SQS', 'AWS CloudFormation', 'AWS Step Functions', 'B'),
('What database engine is used in Amazon Aurora?', 'PostgreSQL and MySQL', 'Oracle', 'MongoDB', 'SQLite', 'A'),
('Which service manages access permissions?', 'AWS IAM', 'Amazon Cognito', 'AWS Directory Service', 'AWS Secrets Manager', 'A'),
('What is the primary function of Amazon Route 53?', 'Website hosting', 'DNS management', 'Monitoring resources', 'Load balancing', 'B'),
('Which AWS service helps automate deployments?', 'AWS CodeDeploy', 'Amazon QuickSight', 'AWS Glue', 'Amazon Kinesis', 'A'),
('What type of storage is Amazon EBS?', 'Object storage', 'Block storage', 'File storage', 'Cold storage', 'B'),
('Which service is used for caching?', 'Amazon ElastiCache', 'AWS Lambda', 'AWS Step Functions', 'AWS Glue', 'A'),
('What does an EC2 instance represent?', 'A virtual server', 'A database engine', 'A storage solution', 'A DNS service', 'A'),
('Which service provides a petabyte-scale data warehouse?', 'Amazon Redshift', 'Amazon Athena', 'AWS Glue', 'Amazon ElastiCache', 'A'),
('Which service is used for real-time application monitoring?', 'Amazon CloudWatch', 'AWS CloudTrail', 'AWS Config', 'AWS Trusted Advisor', 'A'),
('What is the primary function of Amazon RDS?', 'Running managed relational databases', 'Running serverless functions', 'Hosting web applications', 'Monitoring infrastructure', 'A'),
('Which AWS service is responsible for CDN?', 'Amazon CloudFront', 'Amazon CloudWatch', 'Amazon RDS', 'Amazon EKS', 'A'),
('What is a benefit of AWS Auto Scaling?', 'Automatically adjusts resources based on demand', 'Provides identity management', 'Runs serverless applications', 'Hosts static websites', 'A'),
('Which service provides disaster recovery solutions?', 'AWS Backup', 'AWS Migration Hub', 'Amazon SNS', 'Amazon SQS', 'A'),
('What does AWS Elastic Beanstalk automate?', 'Application deployment', 'Monitoring resources', 'Creating virtual machines', 'Managing DNS records', 'A');
