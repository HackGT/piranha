import graphene
from graphene import InputObjectType, ObjectType

from expenses.schema import UserType, ProjectType, VendorType, RequisitionType, RequisitionItemType, PaymentMethodType, ApprovalType, PaymentType
from expenses.utils import process_where_input

from expenses.controllers.UserController import UserController
from expenses.controllers.RequisitionController import RequisitionController
from expenses.controllers.RequisitionItemController import RequisitionItemController
from expenses.controllers.VendorController import VendorController
from expenses.controllers.ProjectController import ProjectController
from expenses.controllers.PaymentMethodController import PaymentMethodController
from expenses.controllers.ApprovalController import ApprovalController
from expenses.controllers.PaymentController import PaymentController


class UserWhereInput(InputObjectType):
    id = graphene.UUID()
    is_active = graphene.Boolean()


class ProjectWhereInput(InputObjectType):
    archived = graphene.Boolean()


class VendorWhereInput(InputObjectType):
    is_active = graphene.Boolean()


class PaymentMethodWhereInput(InputObjectType):
    is_active = graphene.Boolean()


class Query(ObjectType):
    user = graphene.Field(UserType, description="Get information about the current logged in user")
    users = graphene.List(UserType, where=UserWhereInput())

    def resolve_user(self, info, **kwargs):
        return UserController.get_user(info)

    def resolve_users(self, info, **kwargs):
        where = process_where_input(kwargs.get("where", {}))

        return UserController.get_users(info, where)

    project = graphene.Field(ProjectType, year=graphene.Int(), short_code=graphene.String())
    projects = graphene.List(ProjectType, where=ProjectWhereInput())

    def resolve_project(self, info, **kwargs):
        year = kwargs.get("year")
        short_code = kwargs.get("short_code")

        return ProjectController.get_project(info, year, short_code)

    def resolve_projects(self, info, **kwargs):
        where = process_where_input(kwargs.get("where", {}))

        return ProjectController.get_projects(info, where)

    vendor = graphene.Field(VendorType, id=graphene.ID())
    vendors = graphene.List(VendorType, where=VendorWhereInput())

    def resolve_vendor(self, info, **kwargs):
        id = kwargs.get("id")

        return VendorController.get_vendor(info, id)

    def resolve_vendors(self, info, **kwargs):
        where = process_where_input(kwargs.get("where", {}))

        return VendorController.get_vendors(info, where)

    requisition = graphene.Field(RequisitionType, year=graphene.Int(), short_code=graphene.String(), project_requisition_id=graphene.Int())
    requisitions = graphene.List(RequisitionType, description="Get requisitions created by this user for active projects")

    def resolve_requisition(self, info, **kwargs):
        year = kwargs.get("year")
        short_code = kwargs.get("short_code")
        project_requisition_id = kwargs.get("project_requisition_id")

        return RequisitionController.get_requisition(info, year, short_code, project_requisition_id)

    def resolve_requisitions(self, info, **kwargs):
        return RequisitionController.get_requisitions(info)

    requisitionItem = graphene.Field(RequisitionItemType, id=graphene.ID(), description="Get requisition item by ID")

    def resolve_requisitionItem(self, info, **kwargs):
        id = kwargs.get("id")

        return RequisitionItemController.get_requisition_item(info, id)

    payment_method = graphene.Field(PaymentMethodType, id=graphene.ID())
    payment_methods = graphene.List(PaymentMethodType, where=PaymentMethodWhereInput())

    def resolve_payment_method(self, info, **kwargs):
        id = kwargs.get("id")

        return PaymentMethodController.get_payment_method(info, id)

    def resolve_payment_methods(self, info, **kwargs):
        where = process_where_input(kwargs.get("where", {}))

        return PaymentMethodController.get_payment_methods(info, where)

    approval = graphene.Field(ApprovalType, id=graphene.ID())

    def resolve_approval(self, info, **kwargs):
        id = kwargs.get("id")

        return ApprovalController.get_approval(info, id)

    payment = graphene.Field(PaymentType, id=graphene.ID())

    def resolve_payment(self, info, **kwargs):
        id = kwargs.get("id")

        return PaymentController.get_payment(info, id)
