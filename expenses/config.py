from google.cloud import storage
import os

storage_client = storage.Client()
bucket = storage_client.bucket(os.environ["GOOGLE_STORAGE_BUCKET"])
