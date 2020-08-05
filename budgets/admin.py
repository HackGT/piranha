from django.contrib import admin
from .models import BudgetGroup, Budget, OperatingBudget, Category, LineItem


admin.site.register(BudgetGroup)
admin.site.register(Budget)
admin.site.register(OperatingBudget)
admin.site.register(Category)
admin.site.register(LineItem)
