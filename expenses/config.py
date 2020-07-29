from google.cloud import storage
from google.oauth2 import service_account
import os

google_storage_cred = {
    "type": "service_account",
    "project_id": "hackgt-cluster",
    "private_key_id": os.environ["GOOGLE_PRIVATE_ID"],
    "private_key": os.environ['GOOGLE_PRIVATE'].replace(r'\n', '\n'),
    "client_email": "hackgt-storage@hackgt-cluster.iam.gserviceaccount.com",
    "client_id": "112216606107657666067",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/hackgt-storage%40hackgt-cluster.iam.gserviceaccount.com"
}

credentials = service_account.Credentials.from_service_account_info(google_storage_cred)
storage_client = storage.Client(project="hackgt-cluster", credentials=credentials)
bucket = storage_client.bucket("piranha-uploads")
