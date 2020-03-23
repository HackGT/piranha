import graphene
from graphene_django import DjangoObjectType

from expenses.models import FiscalYear


class FiscalYearType(DjangoObjectType):
    class Meta:
        model = FiscalYear
        filter_fields = ['friendly_name']

    @classmethod
    def permission_check(self, info):
        return info.context.user.has_perm("expenses.view_fiscalyear")


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
