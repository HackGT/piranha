from django.contrib import admin
from .models import BudgetGroup, Budget, Category, LineItem, OperatingBudget, OperatingLineItem


admin.site.register(BudgetGroup)
admin.site.register(Budget)
admin.site.register(Category)
admin.site.register(LineItem)
admin.site.register(OperatingBudget)
admin.site.register(OperatingLineItem)
