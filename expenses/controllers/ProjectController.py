from expenses.models import Project


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