import graphene
from graphene import InputObjectType, ObjectType
from budgets.schema import BudgetGroupType, BudgetType, OperatingBudgetType, CategoryType, LineItemType

from budgets.controllers.BudgetController import BudgetController


class Query(ObjectType):
    budgets = graphene.List(BudgetType)

    def resolve_budgets(self, info, **kwargs):
        return BudgetController.get_budgets(info)
