#!/bin/bash

# Create the bucket
awslocal s3 mb s3://image-processing

# Set bucket policy to allow public read access
awslocal s3api put-bucket-policy --bucket image-processing --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::image-processing/*"
        }
    ]
}'

# Create folders
awslocal s3api put-object --bucket image-processing --key original/
awslocal s3api put-object --bucket image-processing --key processed/

echo "S3 bucket 'image-processing' initialized with folders"
