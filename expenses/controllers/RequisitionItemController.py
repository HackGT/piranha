from expenses.models import RequisitionItem


class RequisitionItemController:
    @classmethod
    def get_requisition_item(cls, info, id):
        if info.context.user.has_perm("expenses.view_requisition_item"):
            return RequisitionItem.objects.filter(id=id).first()
