from django.urls import path

from expenses.views import *

urlpatterns = [
    path("", current_datetime),
    path("accounts/profile/", my_account)
]
