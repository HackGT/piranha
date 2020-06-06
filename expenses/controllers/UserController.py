from django.contrib import auth


class UserController:
    @classmethod
    def can_view(cls, user):
        return user.has_perm("seaport.view_user")

    @classmethod
    def get_user(cls, info):
        if cls.can_view(info.context.user):
            return info.context.user

    @classmethod
    def get_users(cls, info, where):
        if cls.can_view(info.context.user):
            return auth.get_user_model().objects.filter(**where)