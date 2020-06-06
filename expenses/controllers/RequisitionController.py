from expenses.models import Requisition


class RequisitionController:
    @classmethod
    def can_view(cls, user):
        return user.has_perm("expenses.view_requisition")

    @classmethod
    def get_requisition(cls, info, year, short_code, project_requisition_id):
        if cls.can_view(info.context.user):
            return Requisition.objects.get(project__year=year,
                                           project__short_code=short_code,
                                           project_requisition_id=project_requisition_id)

    @classmethod
    def get_requisitions(cls, info):
        if cls.can_view(info.context.user):
            return Requisition.objects.filter(created_by=info.context.user, project__archived=False)