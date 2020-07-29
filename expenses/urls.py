from django.urls import path
from expenses.views import get_file

urlpatterns = [
    path("<file_name>", get_file),
]
