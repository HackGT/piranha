import graphene
from django.contrib import auth
from graphene_django import DjangoObjectType
from graphene import InputObjectType

from expenses.models import Project


class UserType(DjangoObjectType):
    class Meta:
        model = auth.get_user_model()
        name = "User"
        exclude_fields = ["password"]


class ProjectType(DjangoObjectType):
    leads = graphene.List(UserType)

    @graphene.resolve_only_args
    def resolve_leads(self):
        # TODO: permissions
        return self.leads.all()

    class Meta:
        model = Project
        name = "Project"

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("expenses.view_project")


class ProjectWhereInput(InputObjectType):
    archived = graphene.Boolean()


class Query(graphene.ObjectType):
    project = graphene.Field(ProjectType, id=graphene.Int())
    projects = graphene.List(ProjectType, where=ProjectWhereInput())

    def resolve_project(self, info, **kwargs):
        id = kwargs.get("id")

        if ProjectType.permission_check(info):
            return Project.objects.get(id=id)

    def resolve_projects(self, info, **kwargs):
        where = kwargs.get("where", {})

        if ProjectType.permission_check(info):
            return Project.objects.filter(**where)
        return None
