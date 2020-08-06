from budgets.models import Budget


class BudgetController:
    @classmethod
    def get_budgets(cls, info):
        if info.context.user.has_perm("budgets.view_budget"):
            return Budget.objects.all()
