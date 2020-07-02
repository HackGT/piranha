from django.contrib import auth


class UserController:
    @classmethod
    def get_user(cls, info):
        if info.context.user.has_perm("seaport.view_user"):
            return info.context.user

    @classmethod
    def get_users(cls, info, where):
        if info.context.user.has_perm("seaport.view_user"):
            return auth.get_user_model().objects.filter(**where)
