from budgets.models import LineItem, Category


class LineItemController:
    @classmethod
    def create_line_item(cls, info, data):
        if info.context.user.has_perm("budgets.add_line_item"):
            category = Category.objects.get(id=data["category"])
            new_data = {
                "category": category
            }
            new_data.update({k: v for k, v in data.items() if k not in ["category"]})

            line_item = LineItem.objects.create(**new_data)

            return line_item

    @classmethod
    def update_line_item(cls, info, id, data):
        if info.context.user.has_perm("budgets.change_line_item"):
            query = LineItem.objects.filter(id=id)
            query.update(**data)

            return query.first()

    @classmethod
    def delete_line_item(cls, info, id):
        if info.context.user.has_perm("budgets.delete_line_item"):
            line_item = LineItem.objects.get(id=id)

            line_item.delete()

            return True
        return False
