from django.contrib import admin
# Register your models here.
from rules.contrib.admin import ObjectPermissionsModelAdmin

from expenses.models import Project, Requisition, Vendor, RequisitionItem, Approval, Payment, PaymentMethod, File


class RequisitionAdmin(ObjectPermissionsModelAdmin):
    pass


admin.site.register(Project)
admin.site.register(Requisition, RequisitionAdmin)
admin.site.register(Vendor)
admin.site.register(RequisitionItem)
admin.site.register(Approval)
admin.site.register(Payment)
admin.site.register(PaymentMethod)
admin.site.register(File)
