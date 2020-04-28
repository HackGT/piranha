import graphene
from django.contrib import auth
from graphene_django import DjangoObjectType

from expenses.models import FiscalYear, Project


class FiscalYearType(DjangoObjectType):
    class Meta:
        model = FiscalYear
        filter_fields = ['friendly_name']

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("expenses.view_fiscalyear")


class UserType(DjangoObjectType):
    class Meta:
        model = auth.get_user_model()
        exclude_fields = ["password"]


class ProjectType(DjangoObjectType):
    leads = graphene.List(UserType)

    @graphene.resolve_only_args
    def resolve_leads(self):
        # TODO: permissions
        return self.leads.all()

    class Meta:
        model = Project

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("expenses.view_project") and FiscalYearType.permission_check(info)

class Query(graphene.ObjectType):
    fiscal_year = graphene.Field(FiscalYearType, id=graphene.Int())
    fiscal_years = graphene.List(FiscalYearType)

    def resolve_fiscal_year(self, info, **kwargs):
        id = kwargs.get("id")
        if FiscalYearType.permission_check(info):
            return FiscalYear.objects.get(id=id)
        return None

    def resolve_fiscal_years(self, info, **kwargs):
        if FiscalYearType.permission_check(info):
            return FiscalYear.objects.all()
        return None

    project = graphene.Field(ProjectType, id=graphene.Int())
    projects = graphene.List(ProjectType)

    def resolve_project(self, info, **kwargs):
        id = kwargs.get("id")

        if ProjectType.permission_check(info):
            return Project.objects.get(id=id)

    def resolve_projects(self, info, **kwargs):
        if ProjectType.permission_check(info):
            return Project.objects.all()
        return None
