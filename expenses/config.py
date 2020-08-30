from google.cloud import storage
import os
from slack import WebClient

storage_client = storage.Client()
bucket = storage_client.bucket(os.environ["GOOGLE_STORAGE_BUCKET"])

slack_client = WebClient(token=os.environ.get('SLACK_API_TOKEN', ''))