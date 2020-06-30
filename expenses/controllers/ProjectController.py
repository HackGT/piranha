from expenses.models import Project
from django.contrib import auth


class ProjectController:
    @classmethod
    def can_view(cls, user):
        return user.has_perm("expenses.view_project")

    @classmethod
    def get_project(cls, info, year, short_code):
        if cls.can_view(info.context.user):
            return Project.objects.get(year=year, short_code=short_code)

    @classmethod
    def get_projects(cls, info, where):
        if cls.can_view(info.context.user):
            return Project.objects.filter(**where)

    @classmethod
    def create_project(cls, info, data):
        project = Project.objects.create(**{k: v for k, v in data.items() if k not in ["leads"]})

        leads = auth.get_user_model().objects.filter(id__in=data["leads"])
        project.leads.set(leads)

        return project

    @classmethod
    def update_project(cls, info, id, data):
        query = Project.objects.filter(id=id)
        query.update(**{k: v for k, v in data.items() if k not in ["leads"]})

        project = query.first()

        leads = auth.get_user_model().objects.filter(id__in=data["leads"])
        project.leads.set(leads)

        return project
