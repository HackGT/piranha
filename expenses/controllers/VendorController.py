from expenses.models import Vendor


class VendorController:
    @classmethod
    def get_vendor(cls, info, id):
        if info.context.user.has_perm("expenses.view_vendor"):
            return Vendor.objects.get(id=id)

    @classmethod
    def get_vendors(cls, info, where):
        if info.context.user.has_perm("expenses.view_vendor"):
            return Vendor.objects.filter(**where)
