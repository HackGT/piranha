import graphene
from django.contrib import auth
from graphene_django import DjangoObjectType
from expenses.models import Project, Vendor, Requisition, RequisitionItem, PaymentMethod, Approval, Payment
from expenses.rules import is_exec, is_project_lead
from expenses.controllers.UserController import UserController, UserAccessLevel


class UserType(DjangoObjectType):
    has_admin_access = graphene.Boolean()

    def resolve_has_admin_access(self, info):
        return UserController.get_has_admin_access(self)

    access_level = UserAccessLevel()

    def resolve_access_level(self, info):
        return UserController.get_user_access_level(self)

    ground_truth_id = graphene.UUID()

    def resolve_ground_truth_id(self, info):
        return UserController.get_ground_truth_id(self)

    full_name = graphene.String()

    def resolve_full_name(self, info):
        return UserController.get_full_name(self)

    class Meta:
        model = auth.get_user_model()
        name = "User"
        fields = ["id", "first_name", "preferred_name", "last_name", "is_active", "email", "has_admin_access"]


class ProjectType(DjangoObjectType):
    leads = graphene.List(UserType)

    def resolve_leads(self, info):
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

    can_cancel = graphene.Boolean()

    def resolve_can_cancel(self, info):
        return is_exec(info.context.user)

    can_expense = graphene.Boolean()

    def resolve_can_expense(self, info):
        # User can expense if they are exec or a project lead and the status if one of these
        return is_exec(info.context.user) or (is_project_lead(info.context.user, self) and self.status in ["Draft", "Pending Changes", "Submitted",])

    reference_string = graphene.String()

    def resolve_reference_string(self, info):
        return self.reference_string

    class Meta:
        model = Requisition
        name = "Requisition"


class PaymentMethodType(DjangoObjectType):
    class Meta:
        model = PaymentMethod
        name = "PaymentMethod"


class RequisitionItemType(DjangoObjectType):
    class Meta:
        model = RequisitionItem
        name = "RequisitionItem"


class ApprovalType(DjangoObjectType):
    class Meta:
        model = Approval
        name = "Approval"


class PaymentType(DjangoObjectType):
    class Meta:
        model = Payment
        name = "Payment"