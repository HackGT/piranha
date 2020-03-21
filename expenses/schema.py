import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from expenses.models import FiscalYear


class FiscalYearNode(DjangoObjectType):
    class Meta:
        model = FiscalYear
        filter_fields = ['friendly_name']
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    category = relay.Node.Field(FiscalYearNode)
    all_fiscal_years = DjangoFilterConnectionField(FiscalYearNode)
