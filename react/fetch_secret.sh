#!/bin/sh

echo "Setting Google Cloud project to $PROJECT_NUMBER..."
gcloud config set project $PROJECT_NUMBER

echo "Fetching secret from Secret Manager..."
secret=$(gcloud secrets versions access latest --secret=$SECRET_ID --project=$PROJECT_NUMBER)

if [ -z "$secret" ]; then
  echo "Failed to fetch secret."
  exit 1
fi

echo "Writing secret to $DESTINATION_FILE..."
echo "$secret" > $DESTINATION_FILE

echo "Secret written to $DESTINATION_FILE"
