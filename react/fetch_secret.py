from google.cloud import secretmanager
from google.oauth2 import service_account
import os, sys
import json
import logging


def fetch_secret(project_number, secret_id, version_id, destination_file):
    logging.info("Initializing Secret Manager client with provided credentials")
    secret_content = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not secret_content:
        logging.error("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set")
        sys.exit(1)

    credentials_info = json.loads(secret_content)
    credentials = service_account.Credentials.from_service_account_info(
        credentials_info
    )
    client = secretmanager.SecretManagerServiceClient(credentials=credentials)
    name = f"projects/{project_number}/secrets/{secret_id}/versions/{version_id}"
    logging.info(f"Fetching secret from {name}")
    try:
        response = client.access_secret_version(request={"name": name}, timeout=30)
        logging.info(f"Writing secret to {destination_file}")
        with open(destination_file, "wb") as f:
            f.write(response.payload.data)
        logging.info(f"Secret written to {destination_file}")
    except Exception as e:
        logging.error(f"Failed to fetch secret: {e}")
        sys.exit(1)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    project_number = os.environ.get("PROJECT_NUMBER")
    secret_id = os.environ.get("SECRET_ID")
    version_id = os.environ.get("VERSION_ID", "latest")
    destination_file = os.environ.get("DESTINATION_FILE", "/app/service-account.json")

    fetch_secret(project_number, secret_id, version_id, destination_file)
