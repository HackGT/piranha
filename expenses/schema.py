import graphene
from django.contrib import auth
from graphene_django import DjangoObjectType
from expenses.models import Project, Vendor, Requisition, RequisitionItem
from expenses.rules import is_exec


class UserType(DjangoObjectType):
    has_admin_access = graphene.Boolean()

    def resolve_has_admin_access(self, info):
        return is_exec(info.context.user)

    class Meta:
        model = auth.get_user_model()
        name = "User"
        fields = ["id", "preferred_name", "last_name", "is_staff", "is_active", "email", "has_admin_access"]


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


class VendorType(DjangoObjectType):
    class Meta:
        model = Vendor
        name = "Vendor"


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


class RequisitionItemType(DjangoObjectType):
    class Meta:
        model = RequisitionItem
        name = "RequisitionItem"
