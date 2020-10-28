from django.contrib import admin
from rules.contrib.admin import ObjectPermissionsModelAdmin

from .models import BudgetGroup, Budget, Category, LineItem, OperatingBudget, OperatingLineItem


class OperatingLineItemInline(admin.TabularInline):
    model = OperatingLineItem
    extra = 3


class OperatingBudgetAdmin(ObjectPermissionsModelAdmin):
    inlines = [OperatingLineItemInline]


class LineItemInline(admin.TabularInline):
    model = LineItem
    extra = 3


class CategoryAdmin(ObjectPermissionsModelAdmin):
    inlines = [LineItemInline]


class CategoryInline(admin.TabularInline):
    model = Category
    extra = 1


class BudgetAdmin(ObjectPermissionsModelAdmin):
    inlines = [CategoryInline]


admin.site.register(BudgetGroup)
admin.site.register(Budget, BudgetAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(LineItem)
admin.site.register(OperatingBudget, OperatingBudgetAdmin)
admin.site.register(OperatingLineItem)
