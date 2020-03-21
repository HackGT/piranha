from django.contrib.auth.mixins import PermissionRequiredMixin

# Create your views here.
from graphene_django.views import GraphQLView


class PrivateGraphQLView(PermissionRequiredMixin, GraphQLView):
    permission_required = "can_view_project"
