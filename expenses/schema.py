import graphene
from django.contrib import auth
from graphene_django import DjangoObjectType
from graphene import InputObjectType

from expenses.models import Project, Vendor, Requisition, RequisitionItem


# Processes where input ex. changes {'a': 2, 'b': 3, 'c': {'b': 2, 'd': {'e': 5}}}
# to {'a': 2, 'b': 3, 'c__b': 2, 'c__d__e': 5} to account for Django foreign key queryset
def process_where_input(where_dict):
    new_dict = {}

    for key in where_dict:
        if isinstance(where_dict[key], dict):
            where_dict[key] = process_where_input(where_dict[key])

            for sub_key in where_dict[key]:
                new_dict[key + '__' + sub_key] = where_dict[key][sub_key]

        else:
            new_dict[key] = where_dict[key]

    return new_dict


class UserType(DjangoObjectType):
    class Meta:
        model = auth.get_user_model()
        name = "User"
        exclude_fields = ["password"]

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("seaport.view_user")


class UserWhereInput(InputObjectType):
    id = graphene.UUID()
    is_active = graphene.Boolean()


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

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("expenses.view_project")


class ProjectWhereInput(InputObjectType):
    archived = graphene.Boolean()


class VendorType(DjangoObjectType):
    class Meta:
        model = Vendor
        name = "Vendor"

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("expenses.view_vendor")


class VendorWhereInput(InputObjectType):
    is_active = graphene.Boolean()


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

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("expenses.view_requisition")


class RequisitionItemType(DjangoObjectType):
    class Meta:
        model = RequisitionItem
        name = "RequisitionItem"

    @classmethod
    def permission_check(cls, info):
        return info.context.user.has_perm("expenses.view_requisition_item")


class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.ID())
    users = graphene.List(UserType, where=UserWhereInput())

    def resolve_user(self, info, **kwargs):
        print([group.name for group in info.context.user.groups.all()])

        if UserType.permission_check(info):
            return info.context.user

    def resolve_users(self, info, **kwargs):
        where = process_where_input(kwargs.get("where", {}))

        if UserType.permission_check(info):
            return auth.get_user_model().objects.filter(**where)
        return None

    project = graphene.Field(ProjectType, year=graphene.Int(), short_code=graphene.String())
    projects = graphene.List(ProjectType, where=ProjectWhereInput())

    def resolve_project(self, info, **kwargs):
        year = kwargs.get("year")
        short_code = kwargs.get("short_code")

        if ProjectType.permission_check(info):
            return Project.objects.get(year=year, short_code=short_code)

    def resolve_projects(self, info, **kwargs):
        where = process_where_input(kwargs.get("where", {}))

        if ProjectType.permission_check(info):
            return Project.objects.filter(**where)
        return None

    vendor = graphene.Field(VendorType, id=graphene.ID())
    vendors = graphene.List(VendorType, where=VendorWhereInput())

    def resolve_vendor(self, info, **kwargs):
        id = kwargs.get("id")

        if VendorType.permission_check(info):
            return Vendor.objects.get(id=id)

    def resolve_vendors(self, info, **kwargs):
        where = process_where_input(kwargs.get("where", {}))

        if VendorType.permission_check(info):
            return Vendor.objects.filter(**where)
        return None

    requisition = graphene.Field(RequisitionType, year=graphene.Int(), short_code=graphene.String(), project_requisition_id=graphene.Int())
    requisitions = graphene.List(RequisitionType, description="Get requisitions created by this user for active projects")

    def resolve_requisition(self, info, **kwargs):
        year = kwargs.get("year")
        short_code = kwargs.get("short_code")
        project_requisition_id = kwargs.get("project_requisition_id")

        print(year, short_code, project_requisition_id)

        if RequisitionType.permission_check(info):
            return Requisition.objects.get(project__year=year, project__short_code=short_code, project_requisition_id=project_requisition_id)

    def resolve_requisitions(self, info, **kwargs):
        if RequisitionType.permission_check(info):
            return Requisition.objects.filter(created_by=info.context.user, project__archived=False)
        return None

    requisitionItem = graphene.Field(RequisitionItemType, id=graphene.ID(), description="Get requisition item by ID")

    def resolve_requisitionItem(self, info, **kwargs):
        id = kwargs.get("id")

        if RequisitionItemType.permission_check(info):
            return RequisitionItem.objects.get(id=id)
