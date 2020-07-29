from django.contrib.auth.mixins import UserPassesTestMixin

# Create your views here.
from graphene_file_upload.django import FileUploadGraphQLView


class PrivateGraphQLView(UserPassesTestMixin, FileUploadGraphQLView):
    def test_func(self):
        return self.request.user.groups.filter(name="member").exists()
