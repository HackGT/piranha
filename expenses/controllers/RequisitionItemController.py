from expenses.models import RequisitionItem


class RequisitionItemController:
    @classmethod
    def can_view(cls, user):
        return user.has_perm("expenses.view_requisition_item")

    @classmethod
    def get_requisition_item(cls, info, id):
        if cls.can_view(info.context.user):
            return RequisitionItem.objects.get(id=id)