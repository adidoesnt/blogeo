#!/bin/bash

# bucket.sh

# Creates or deletes SQS buckets in Localstack

DELETE=false
LIST=false
BUCKET_NAMES=""
REGION=""
FLAG_PROVIDED=false

while getopts "d:lr:" opt; do
    case $opt in
    d)
        DELETE=true
        BUCKET_NAMES=$OPTARG
        ;;
    l)
        LIST=true
        ;;
    r)
        REGION=$OPTARG
        ;;
    ?)
        echo "Invalid option: -$OPTARG" >&2
        ;;
    esac
done

shift "$(($OPTIND - 1))"

if [ -z "$BUCKET_NAMES" ] && [ -n "$1" ]; then
    BUCKET_NAMES=$1
fi

if [ -z "$REGION" ]; then
    REGION="ap-southeast-1"
fi

if [ "$LIST" = true ]; then
    OUTPUT=$(aws --endpoint-url=http://localhost:4566 s3api list-buckets --region $REGION)
    if [ -z "$OUTPUT" ]; then
        echo "There are no buckets"
    else
        echo "$OUTPUT"
    fi
    exit 0
fi

if [ -z "$BUCKET_NAMES" ]; then
    echo "Bucket name(s) required"
    exit 1
fi

if ! docker image inspect localstack/localstack >/dev/null 2>&1; then
    echo "Image does not exist locally. Pulling..."
    docker pull localstack/localstack
else
    echo "Image already exists locally."
fi

if docker ps --format '{{.Names}}' | grep -Eq "^localstack$"; then
    echo "Localstack container is already running."
else
    if docker ps -a --format '{{.Names}}' | grep -Eq "^localstack$"; then
        echo "Starting existing localstack container..."
        docker start localstack >/dev/null
    else
        echo "Starting localstack in a new container..."
        docker run -d -p 4566:4566 -p 4571:4571 --name localstack localstack/localstack
    fi
fi

IFS=',' read -r -a bucket_array <<<"$BUCKET_NAMES"

for BUCKET_NAME in "${bucket_array[@]}"; do
    if [ "$DELETE" = true ]; then
        if ! output=$(aws --endpoint-url=http://localhost:4566 s3api delete-bucket --bucket $BUCKET_NAME --region $REGION 2>&1); then
            if [[ $output == *"NoSuchBucket"* ]]; then
                echo "Bucket $BUCKET_NAME does not exist."
            else
                echo "Failed to delete bucket $BUCKET_NAME: $output"
            fi
        else
            echo "Bucket $BUCKET_NAME deleted successfully"
        fi
    else
        echo "Creating bucket $BUCKET_NAME..."
        if output=$(aws --endpoint-url=http://localhost:4566 s3api head-bucket --bucket $BUCKET_NAME --region $REGION 2>&1); then
            echo "Bucket $BUCKET_NAME already exists."
        else
            if [[ $output == *"404"* ]]; then
                aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket $BUCKET_NAME --region $REGION --create-bucket-configuration LocationConstraint=$REGION >/dev/null
                echo "Bucket $BUCKET_NAME created successfully"
            else
                echo "Failed to check bucket $BUCKET_NAME existence: $output"
            fi
        fi
    fi
done
