import graphene
from graphene import Mutation, ObjectType

from budgets.controllers.LineItemController import LineItemController
from budgets.models import LineItem
from budgets.schema import LineItemType
from graphene_django_extras import DjangoInputObjectType


class LineItemInput(DjangoInputObjectType):
    class Meta:
        model = LineItem
        exclude_fields = ["requisitionitem"]


class CreateLineItemMutation(Mutation):
    line_item = graphene.Field(LineItemType)

    class Arguments:
        data = graphene.Argument(LineItemInput, required=True)

    def mutate(self, info, data):
        return CreateLineItemMutation(line_item=LineItemController.create_line_item(info, data))


class UpdateLineItemMutation(Mutation):
    line_item = graphene.Field(LineItemType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(LineItemInput, required=True)

    def mutate(self, info, id, data):
        return UpdateLineItemMutation(line_item=LineItemController.update_line_item(info, id, data))


class DeleteLineItemMutation(Mutation):
    success = graphene.Field(graphene.Boolean)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        return DeleteLineItemMutation(success=LineItemController.delete_line_item(info, id))


class Mutation(ObjectType):
    create_line_item = CreateLineItemMutation.Field()
    update_line_item = UpdateLineItemMutation.Field()
    delete_line_item = DeleteLineItemMutation.Field()
