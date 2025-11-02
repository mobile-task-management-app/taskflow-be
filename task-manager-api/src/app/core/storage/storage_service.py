from datetime import datetime
from google.cloud.storage import Client, Bucket
from google.cloud import storage
from app.core.configs.gcs_config import GCSConfig


def initialize_gcs_client():
    """Initializes the GCS client using Application Default Credentials (ADC)."""

    client = storage.Client()

    print("GCS client initialized successfully.")

    return client


class GCSStorageService:
    def __init__(self, client: Client, gcs_cfg: GCSConfig):
        self.gcs_client = client
        self.gcs_cfg = gcs_cfg

    def get_presign_url_put(
        self, path: str, content_type: str, expire_in: int = 30
    ) -> str:

        bucket: Bucket = self.gcs_client.bucket(self.gcs_cfg.bucket)
        blob = bucket.blob(path)
        url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=expire_in),
            method="PUT",
            content_type=content_type,
        )
        return url

    def download_file(self, path: str, f):
        bucket: Bucket = self.gcs_client.bucket(self.gcs_cfg.bucket)
        blob = bucket.blob(path)
        blob.download_to_file(f)
