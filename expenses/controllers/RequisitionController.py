from django.db.models import Max
from itertools import zip_longest
from expenses.models import Requisition, Project, Vendor, RequisitionItem


class RequisitionController:
    @classmethod
    def get_requisition(cls, info, year, short_code, project_requisition_id):
        if info.context.user.has_perm("expenses.view_requisition"):
            return Requisition.objects.get(project__year=year,
                                           project__short_code=short_code,
                                           project_requisition_id=project_requisition_id)

    @classmethod
    def get_requisitions(cls, info):
        if info.context.user.has_perm("expenses.view_requisition"):
            return Requisition.objects.filter(created_by=info.context.user, project__archived=False)

    @classmethod
    def create_requisition(cls, info, data):
        if info.context.user.has_perm("expenses.add_requisition"):
            project = Project.objects.get(id=data["project"])
            id_max = Requisition.objects.filter(project=project).aggregate(Max('project_requisition_id'))
            new_data = {
                "project": project,
                "vendor": Vendor.objects.get(id=data["vendor"]) if "vendor" in data else None,
                "project_requisition_id": (id_max["project_requisition_id__max"] or 0) + 1,
                "created_by": info.context.user
            }
            new_data.update({k: v for k, v in data.items() if k not in ["requisitionitemSet", "project", "vendor"]})

            requisition = Requisition.objects.create(**new_data)

            for item in data.requisitionitemSet:
                item_new_data = {
                    "requisition": requisition
                }
                item_new_data.update(item)
                RequisitionItem.objects.create(**item_new_data)

            return requisition

    @classmethod
    def update_requisition(cls, info, id, data):
        if info.context.user.has_perm("expenses.change_requisition"):
            query = Requisition.objects.filter(id=id)

            new_data = {
                "project": Project.objects.get(id=data["project"]),
                "vendor": Vendor.objects.get(id=data["vendor"]) if "vendor" in data else None,
            }
            new_data.update({k: v for k, v in data.items() if k not in ["requisitionitemSet", "project", "vendor"]})

            query.update(**new_data)
            requisition = query.first()

            # Will create new item, delete extra items in db, and update existing item respectively
            for new_item, existing_item in zip_longest(data.requisitionitemSet, list(RequisitionItem.objects.filter(requisition=requisition))):
                if not existing_item:
                    item_new_data = {
                        "requisition": requisition
                    }
                    item_new_data.update(new_item)
                    RequisitionItem.objects.create(**item_new_data)
                elif not new_item:
                    existing_item.delete()
                else:
                    for (key, value) in new_item.items():
                        setattr(existing_item, key, value)
                    existing_item.save()

            return requisition
