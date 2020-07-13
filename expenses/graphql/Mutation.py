import graphene
from graphene import Mutation, ObjectType
from expenses.schema import ProjectType, VendorType, RequisitionType, PaymentMethodType, PaymentType, ApprovalType
from graphene_django_extras import DjangoInputObjectType

from expenses.models import Project, Vendor, Requisition, RequisitionItem, PaymentMethod, Payment, Approval

from expenses.controllers.RequisitionController import RequisitionController
from expenses.controllers.VendorController import VendorController
from expenses.controllers.ProjectController import ProjectController
from expenses.controllers.PaymentMethodController import PaymentMethodController
from expenses.controllers.PaymentController import PaymentController
from expenses.controllers.ApprovalController import ApprovalController


# ------------------------------ Project Schema ------------------------------ #


class ProjectInput(DjangoInputObjectType):
    class Meta:
        model = Project
        exclude_fields = ["requisition"]


class CreateProjectMutation(Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        data = graphene.Argument(ProjectInput, required=True)

    def mutate(self, info, data):
        return CreateProjectMutation(project=ProjectController.create_project(info, data))


class UpdateProjectMutation(Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(ProjectInput, required=True)

    def mutate(self, info, id, data):
        return UpdateProjectMutation(project=ProjectController.update_project(info, id, data))


# ------------------------------- Vendor Schema ------------------------------ #


class VendorInput(DjangoInputObjectType):
    class Meta:
        model = Vendor
        exclude_fields = ["payment", "requisition"]


class CreateVendorMutation(Mutation):
    vendor = graphene.Field(VendorType)

    class Arguments:
        data = graphene.Argument(VendorInput, required=True)

    def mutate(self, info, data):
        return CreateVendorMutation(vendor=VendorController.create_vendor(info, data))


class UpdateVendorMutation(Mutation):
    vendor = graphene.Field(VendorType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(VendorInput, required=True)

    def mutate(self, info, id, data):
        return UpdateVendorMutation(vendor=VendorController.update_vendor(info, id, data))


class DeleteVendorMutation(Mutation):
    success = graphene.Field(graphene.Boolean)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        return DeleteVendorMutation(success=VendorController.delete_vendor(info, id))


# ---------------------------- Requisition Schema ---------------------------- #


class RequisitionItemInput(DjangoInputObjectType):
    class Meta:
        model = RequisitionItem
        exclude_fields = ["requisition"]


class RequisitionInput(DjangoInputObjectType):
    requisitionitemSet = graphene.List(RequisitionItemInput)

    class Meta:
        model = Requisition
        exclude_fields = ["approval", "payment", "created_by", "project_requisition_id", "requisitionitem"]


class CreateRequisitionMutation(Mutation):
    requisition = graphene.Field(RequisitionType)

    class Arguments:
        data = graphene.Argument(RequisitionInput, required=True)

    def mutate(self, info, data):
        return CreateRequisitionMutation(requisition=RequisitionController.create_requisition(info, data))


class UpdateRequisitionMutation(Mutation):
    requisition = graphene.Field(RequisitionType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(RequisitionInput, required=True)

    def mutate(self, info, id, data):
        return UpdateRequisitionMutation(requisition=RequisitionController.update_requisition(info, id, data))


# --------------------------- Payment Method Schema -------------------------- #


class PaymentMethodInput(DjangoInputObjectType):
    class Meta:
        model = PaymentMethod
        exclude_fields = ["payment"]


class CreatePaymentMethodMutation(Mutation):
    payment_method = graphene.Field(PaymentMethodType)

    class Arguments:
        data = graphene.Argument(PaymentMethodInput, required=True)

    def mutate(self, info, data):
        return CreatePaymentMethodMutation(payment_method=PaymentMethodController.create_payment_method(info, data))


class UpdatePaymentMethodMutation(Mutation):
    payment_method = graphene.Field(PaymentMethodType)

    class Arguments:
        id = graphene.ID(required=True)
        data = graphene.Argument(PaymentMethodInput, required=True)

    def mutate(self, info, id, data):
        return UpdatePaymentMethodMutation(payment_method=PaymentMethodController.update_payment_method(info, id, data))


class DeletePaymentMethodMutation(Mutation):
    success = graphene.Field(graphene.Boolean)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        return DeletePaymentMethodMutation(success=PaymentMethodController.delete_payment_method(info, id))


# ------------------------------ Payment Schema ------------------------------ #


class PaymentInput(DjangoInputObjectType):
    class Meta:
        model = Payment


class CreatePaymentMutation(Mutation):
    payment = graphene.Field(PaymentType)

    class Arguments:
        data = graphene.Argument(PaymentInput, required=True)

    def mutate(self, info, data):
        return CreatePaymentMutation(payment=PaymentController.create_payment(info, data))


# ------------------------------ Approval Schema ----------------------------- #


class ApprovalInput(DjangoInputObjectType):
    class Meta:
        model = Approval
        exclude_fields = ["approver"]


class CreateApprovalMutation(Mutation):
    approval = graphene.Field(ApprovalType)

    class Arguments:
        data = graphene.Argument(ApprovalInput, required=True)

    def mutate(self, info, data):
        return CreateApprovalMutation(approval=ApprovalController.create_approval(info, data))


class Mutation(ObjectType):
    create_project = CreateProjectMutation.Field()
    update_project = UpdateProjectMutation.Field()

    create_requisition = CreateRequisitionMutation.Field()
    update_requisition = UpdateRequisitionMutation.Field()

    create_vendor = CreateVendorMutation.Field()
    update_vendor = UpdateVendorMutation.Field()
    delete_vendor = DeleteVendorMutation.Field()

    create_payment_method = CreatePaymentMethodMutation.Field()
    update_payment_method = UpdatePaymentMethodMutation.Field()
    delete_payment_method = DeletePaymentMethodMutation.Field()

    create_payment = CreatePaymentMutation.Field()

    create_approval = CreateApprovalMutation.Field()

