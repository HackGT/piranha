from expenses.models import Payment, PaymentMethod, Vendor, Requisition, RequisitionStatus


class PaymentController:
    @classmethod
    def get_payment(cls, info, id):
        if info.context.user.has_perm("expenses.view_payment"):
            return Payment.objects.get(id=id)

    @classmethod
    def create_payment(cls, info, data):
        if info.context.user.has_perm("expenses.add_payment"):
            requisition = Requisition.objects.get(id=data["requisition"])
            new_data = {
                "funding_source": PaymentMethod.objects.get(id=data["funding_source"]),
                "recipient": Vendor.objects.get(id=data["recipient"]),
                "requisition": requisition
            }
            new_data.update({k: v for k, v in data.items() if k not in ["funding_source", "recipient", "requisition"]})

            payment = Payment.objects.create(**new_data)

            return payment
