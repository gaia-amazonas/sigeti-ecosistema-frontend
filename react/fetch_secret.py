# fetch_secret.py
from google.cloud import secretmanager
import os


def fetch_secret(project_id, secret_id, version_id, destination_file):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(request={"name": name})
    with open(destination_file, "wb") as f:
        f.write(response.payload.data)


if __name__ == "__main__":
    project_id = os.environ.get("PROJECT_ID")
    secret_id = os.environ.get("SECRET_ID")
    version_id = os.environ.get("VERSION_ID", "latest")
    destination_file = os.environ.get(
        "DESTINATION_FILE", "/app/sigeti-ca02d3a77e56.json"
    )
    fetch_secret(project_id, secret_id, version_id, destination_file)
