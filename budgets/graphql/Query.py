import graphene
from graphene import InputObjectType, ObjectType
from budgets.schema import BudgetGroupType, BudgetType, OperatingBudgetType, CategoryType, LineItemType

from budgets.controllers.BudgetController import BudgetController


class Query(ObjectType):
    budget = graphene.Field(BudgetType, id=graphene.ID())
    budgets = graphene.List(BudgetType)

    def resolve_budget(self, info, **kwargs):
        id = kwargs.get("id")

        return BudgetController.get_budget(info, id)

    def resolve_budgets(self, info, **kwargs):
        return BudgetController.get_budgets(info)
