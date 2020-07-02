import graphene
from django.contrib import auth
from graphene_django import DjangoObjectType
from graphene import InputObjectType
from expenses.utils import process_where_input
from graphene_django_extras import DjangoInputObjectType

from expenses.models import Project, Vendor, Requisition, RequisitionItem

from expenses.controllers.UserController import UserController
from expenses.controllers.RequisitionController import RequisitionController
from expenses.controllers.RequisitionItemController import RequisitionItemController
from expenses.controllers.VendorController import VendorController
from expenses.controllers.ProjectController import ProjectController


# -------------------------------- User Schema ------------------------------- #


class UserType(DjangoObjectType):
    class Meta:
        model = auth.get_user_model()
        name = "User"
        exclude_fields = ["password"]


class UserWhereInput(InputObjectType):
    id = graphene.UUID()
    is_active = graphene.Boolean()


# ------------------------------ Project Schema ------------------------------ #


class ProjectWhereInput(InputObjectType):
    archived = graphene.Boolean()


class ProjectType(DjangoObjectType):
    leads = graphene.List(UserType)

    @graphene.resolve_only_args
    def resolve_leads(self):
        # TODO: permissions
        return self.leads.all()

    reference_string = graphene.String()

    def resolve_reference_string(self, info):
        return self.reference_string

    class Meta:
        model = Project
        name = "Project"


class ProjectInput(DjangoInputObjectType):
    class Meta:
        model = Project
        exclude_fields = ["requisition"]


class CreateProjectMutation(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        data = graphene.Argument(ProjectInput, required=True)

    def mutate(self, info, data):
        return CreateProjectMutation(project=ProjectController.create_project(info, data))


class UpdateProjectMutation(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(ProjectInput, required=True)

    def mutate(self, info, id, data):
        return UpdateProjectMutation(project=ProjectController.update_project(info, id, data))


# ------------------------------- Vendor Schema ------------------------------ #


class VendorType(DjangoObjectType):
    class Meta:
        model = Vendor
        name = "Vendor"


class VendorWhereInput(InputObjectType):
    is_active = graphene.Boolean()


class VendorInput(DjangoInputObjectType):
    class Meta:
        model = Vendor
        exclude_fields = ["payment", "requisition"]


class CreateVendorMutation(graphene.Mutation):
    vendor = graphene.Field(VendorType)

    class Arguments:
        data = graphene.Argument(VendorInput, required=True)

    def mutate(self, info, data):
        return CreateVendorMutation(vendor=VendorController.create_vendor(info, data))


class UpdateVendorMutation(graphene.Mutation):
    vendor = graphene.Field(VendorType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(VendorInput, required=True)

    def mutate(self, info, id, data):
        return UpdateVendorMutation(vendor=VendorController.update_vendor(info, id, data))


class DeleteVendorMutation(graphene.Mutation):
    success = graphene.Field(graphene.Boolean)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        return DeleteVendorMutation(success=VendorController.delete_vendor(info, id))


# ---------------------------- Requisition Schema ---------------------------- #


class RequisitionType(DjangoObjectType):
    can_edit = graphene.Boolean()

    def resolve_can_edit(self, info):
        return info.context.user.has_perm("expenses.change_requisition", self)

    reference_string = graphene.String()

    def resolve_reference_string(self, info):
        return self.reference_string

    class Meta:
        model = Requisition
        name = "Requisition"


class RequisitionItemInput(DjangoInputObjectType):
    class Meta:
        model = RequisitionItem
        exclude_fields = ["requisition"]


class RequisitionInput(DjangoInputObjectType):
    requisitionitemSet = graphene.List(RequisitionItemInput)

    class Meta:
        model = Requisition
        exclude_fields = ["approval", "payment", "created_by", "project_requisition_id", "requisitionitem"]


class CreateRequisitionMutation(graphene.Mutation):
    requisition = graphene.Field(RequisitionType)

    class Arguments:
        data = graphene.Argument(RequisitionInput, required=True)

    def mutate(self, info, data):
        return CreateRequisitionMutation(requisition=RequisitionController.create_requisition(info, data))


class UpdateRequisitionMutation(graphene.Mutation):
    requisition = graphene.Field(RequisitionType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(RequisitionInput, required=True)

    def mutate(self, info, id, data):
        return UpdateRequisitionMutation(requisition=RequisitionController.update_requisition(info, id, data))


class RequisitionItemType(DjangoObjectType):
    class Meta:
        model = RequisitionItem
        name = "RequisitionItem"


# ---------------------------------------------------------------------------- #
#                            QUERY SCHEMA DEFINITION                           #
# ---------------------------------------------------------------------------- #


class Query(graphene.ObjectType):
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


# ---------------------------------------------------------------------------- #
#                          MUTATION SCHEMA DEFINITION                          #
# ---------------------------------------------------------------------------- #


class Mutation(graphene.ObjectType):
    create_project = CreateProjectMutation.Field()
    update_project = UpdateProjectMutation.Field()

    create_requisition = CreateRequisitionMutation.Field()
    update_requisition = UpdateRequisitionMutation.Field()

    create_vendor = CreateVendorMutation.Field()
    update_vendor = UpdateVendorMutation.Field()
    delete_vendor = DeleteVendorMutation.Field()
