import datetime
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from expenses.config import bucket


@login_required
def get_file(request, file_name):
    stripped_file_name = "".join(file_name.split("_")[:-1])
    blob = bucket.blob(file_name)
    url = blob.generate_signed_url(version='v4',
                                   method="GET",
                                   expiration=datetime.timedelta(minutes=10),
                                   response_disposition=f"attachment; filename={stripped_file_name}")

    return redirect(url)
