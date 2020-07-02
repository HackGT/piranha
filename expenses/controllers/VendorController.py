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

    @classmethod
    def create_vendor(cls, info, data):
        if info.context.user.has_perm("expenses.add_vendor"):
            vendor = Vendor.objects.create(**data)

            return vendor

    @classmethod
    def update_vendor(cls, info, id, data):
        if info.context.user.has_perm("expenses.change_vendor"):
            query = Vendor.objects.filter(id=id)
            query.update(**data)

            return query.first()

    @classmethod
    def delete_vendor(cls, info, id):
        if info.context.user.has_perm("expenses.delete_vendor"):
            vendor = Vendor.objects.get(id=id)
            vendor.delete()

            return True

        return False
