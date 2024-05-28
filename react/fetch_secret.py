from google.cloud import secretmanager
import os, sys
import logging


def fetch_secret(project_number, secret_id, version_id, destination_file):
    logging.info("Initializing Secret Manager client")
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_number}/secrets/{secret_id}/versions/{version_id}"
    logging.info(f"Fetching secret from {name}")
    try:
        response = client.access_secret_version(request={"name": name}, timeout=30)
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
