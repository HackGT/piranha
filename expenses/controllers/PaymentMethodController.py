from expenses.models import PaymentMethod


class PaymentMethodController:
    @classmethod
    def get_payment_method(cls, info, id):
        if info.context.user.has_perm("expenses.view_paymentmethod"):
            return PaymentMethod.objects.get(id=id)

    @classmethod
    def get_payment_methods(cls, info, where):
        if info.context.user.has_perm("expenses.view_paymentmethod"):
            return PaymentMethod.objects.filter(**where)

    @classmethod
    def create_payment_method(cls, info, data):
        if info.context.user.has_perm("expenses.add_paymentmethod"):
            return PaymentMethod.objects.create(**data)

    @classmethod
    def update_payment_method(cls, info, id, data):
        if info.context.user.has_perm("expenses.change_paymentmethod"):
            query = PaymentMethod.objects.filter(id=id)
            query.update(**data)

            return query.first()

    @classmethod
    def delete_payment_method(cls, info, id):
        if info.context.user.has_perm("expenses.delete_paymentmethod"):
            payment_method = PaymentMethod.objects.get(id=id)
            payment_method.delete()

            return True

        return False
