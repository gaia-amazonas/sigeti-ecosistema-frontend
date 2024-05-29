#!/bin/sh

echo "Fetching secret from Secret Manager..."
secret=$(gcloud secrets versions access latest --secret=$SECRET_ID)

if [ -z "$secret" ]; then
  echo "Failed to fetch secret."
  exit 1
fi

echo "Writing secret to $DESTINATION_FILE..."
echo "$secret" > $DESTINATION_FILE

echo "Secret written to $DESTINATION_FILE"
