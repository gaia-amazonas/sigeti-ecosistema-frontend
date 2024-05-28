from google.cloud import secretmanager
import os
import sys
import logging


def fetch_secret(project_id, secret_id, version_id, destination_file):
    logging.info("Initializing Secret Manager client")
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    logging.info(f"Fetching secret from {name}")
    try:
        response = client.access_secret_version(
            request={"name": name}, timeout=30
        )  # 30 seconds timeout
        with open(destination_file, "wb") as f:
            f.write(response.payload.data)
        logging.info(f"Secret written to {destination_file}")
    except Exception as e:
        logging.error(f"Failed to fetch secret: {e}")
        sys.exit(1)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    project_id = os.environ.get("PROJECT_ID")
    secret_id = os.environ.get("SECRET_ID")
    version_id = os.environ.get("VERSION_ID", "latest")
    destination_file = os.environ.get(
        "DESTINATION_FILE", "/app/sigeti-ca02d3a77e56.json"
    )
    fetch_secret(project_id, secret_id, version_id, destination_file)
