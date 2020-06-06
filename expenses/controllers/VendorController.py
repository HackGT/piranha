from expenses.models import Vendor


class VendorController:
    @classmethod
    def can_view(cls, user):
        return user.has_perm("expenses.view_vendor")

    @classmethod
    def get_vendor(cls, info, id):
        if cls.can_view(info.context.user):
            return Vendor.objects.get(id=id)

    @classmethod
    def get_vendors(cls, info, where):
        if cls.can_view(info.context.user):
            return Vendor.objects.filter(**where)