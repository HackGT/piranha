from google.cloud import storage
import os
from slack import WebClient
from slack.errors import SlackApiError

storage_client = storage.Client()
bucket = storage_client.bucket(os.environ["GOOGLE_STORAGE_BUCKET"])

slack_client = WebClient(token=os.environ.get('SLACK_API_TOKEN', ''))


def send_slack_notification(requisition):
    # Checks if slack token is provide as env var
    if slack_client.token and requisition.created_by.slack_id:
        if requisition.status == "Submitted":
            message = f"Thank you for submitting requisition {requisition.headline}! You will receive alerts from me when the status is changed."
        elif requisition.status == "Pending Changes":
            message = f"Requisition {requisition.headline} ({requisition}) has requested changes. Notes by reviewer: {requisition.approval_set.latest('id').notes}"
        else:
            message = f"Requisition {requisition.headline} ({requisition}) status updated to *{requisition.status}*"

        try:
            response = slack_client.chat_postMessage(channel=requisition.created_by.slack_id, text=message)
        except SlackApiError as err:
            if err.response["error"] == "channel_not_found":
                print(f"Invalid user slack id for {requisition.created_by}")
            elif err.response["error"] == "invalid_auth":
                print("Invalid slack setup. Please check config")
            else:
                raise err
