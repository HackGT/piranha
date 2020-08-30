from expenses.models import Approval, Requisition, RequisitionStatus
from ..config import send_slack_notification


class ApprovalController:
    @classmethod
    def get_approval(cls, info, id):
        if info.context.user.has_perm("expenses.view_approval"):
            return Approval.objects.get(id=id)

    @classmethod
    def create_approval(cls, info, data):
        if info.context.user.has_perm("expenses.add_approval"):
            requisition = Requisition.objects.get(id=data["requisition"])
            new_data = {
                "approver": info.context.user,
                "requisition": requisition
            }
            new_data.update({k: v for k, v in data.items() if k not in ["approver", "requisition"]})

            approval = Approval.objects.create(**new_data)

            if data["is_approving"] and requisition.is_reimbursement:
                requisition.status = RequisitionStatus.READY_FOR_REIMBURSEMENT
            elif data["is_approving"] and not requisition.is_reimbursement:
                requisition.status = RequisitionStatus.READY_TO_ORDER
            else:
                requisition.status = RequisitionStatus.PENDING_CHANGES

            requisition.save()

            send_slack_notification(requisition)

            return approval
