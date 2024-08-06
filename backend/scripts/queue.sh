#!/bin/bash

# queue.sh

# Creates or deletes SQS queues in Localstack

DELETE=false
LIST=false
QUEUE_NAMES=""
REGION=""
FLAG_PROVIDED=false

while getopts "d:lr:" opt; do
    case $opt in
    d)
        DELETE=true
        QUEUE_NAMES=$OPTARG
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

if [ -z "$QUEUE_NAMES" ] && [ -n "$1" ]; then
    QUEUE_NAMES=$1
fi

if [ -z "$REGION" ]; then
    REGION="ap-southeast-1"
fi

if [ "$LIST" = true ]; then
    OUTPUT=$(aws --endpoint-url=http://localhost:4566 sqs list-queues --region $REGION)
    if [ -z "$OUTPUT" ]; then
        echo "There are no queues"
    else
        echo "$OUTPUT"
    fi
    exit 0
fi

if [ -z "$QUEUE_NAMES" ]; then
    echo "Queue name(s) required"
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

IFS=',' read -r -a queue_array <<<"$QUEUE_NAMES"

for QUEUE_NAME in "${queue_array[@]}"; do
    if [ "$DELETE" = true ]; then
        if ! output=$(aws --endpoint-url=http://localhost:4566 sqs delete-queue --queue-url http://localhost:4566/000000000000/$QUEUE_NAME --region $REGION 2>&1); then
            if [[ $output == *"AWS.SimpleQueueService.NonExistentQueue"* ]]; then
                echo "Queue $QUEUE_NAME does not exist."
            else
                echo "Failed to delete queue $QUEUE_NAME: $output"
            fi
        else
            echo "Queue $QUEUE_NAME deleted successfully"
        fi
    else
        echo "Creating queue $QUEUE_NAME..."
        if output=$(aws --endpoint-url=http://localhost:4566 sqs get-queue-url --queue-name $QUEUE_NAME --region $REGION 2>&1); then
            echo "Queue $QUEUE_NAME already exists."
        else
            if [[ $output == *"NonExistentQueue"* ]]; then
                aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name $QUEUE_NAME >/dev/null
                echo "Queue $QUEUE_NAME created successfully at http://localhost:4566/000000000000/$QUEUE_NAME"
            else
                echo "Failed to check queue $QUEUE_NAME existence: $output"
            fi
        fi
    fi
done