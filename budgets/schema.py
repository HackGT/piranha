import graphene
from graphene_django import DjangoObjectType
from budgets.models import BudgetGroup, Budget, Category, LineItem, OperatingBudget, OperatingLineItem


class BudgetGroupType(DjangoObjectType):
    class Meta:
        model = BudgetGroup
        name = "BudgetGroup"


class BudgetType(DjangoObjectType):
    class Meta:
        model = Budget
        name = "Budget"


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        name = "Category"


class LineItemType(DjangoObjectType):
    class Meta:
        model = LineItem
        name = "LineItem"


class OperatingBudgetType(DjangoObjectType):
    class Meta:
        model = OperatingBudget
        name = "OperatingBudget"


class OperatingLineItemType(DjangoObjectType):
    class Meta:
        model = OperatingLineItem
        name = "OperatingLineItem"
