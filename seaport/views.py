from django.contrib.auth.mixins import UserPassesTestMixin

# Create your views here.
from graphene_django.views import GraphQLView


class PrivateGraphQLView(UserPassesTestMixin, GraphQLView):
    def test_func(self):
        return self.request.user.groups.filter(name="member").exists()
