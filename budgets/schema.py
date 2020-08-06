import graphene
from graphene_django import DjangoObjectType
from budgets.models import BudgetGroup, Budget, OperatingBudget, Category, LineItem


class BudgetGroupType(DjangoObjectType):
    class Meta:
        model = BudgetGroup
        name = "BudgetGroup"


class LineItemType(DjangoObjectType):
    class Meta:
        model = LineItem
        name = "LineItem"


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        name = "Category"


class BudgetType(DjangoObjectType):
    category_set = graphene.List(CategoryType)

    def resolve_category_set(self, info):
        return self.categories.all()

    class Meta:
        model = Budget
        name = "Budget"


class OperatingBudgetType(DjangoObjectType):
    category_set = graphene.List(CategoryType)

    def resolve_category_set(self, info):
        return self.categories.all()

    class Meta:
        model = OperatingBudget
        name = "OperatingBudget"
