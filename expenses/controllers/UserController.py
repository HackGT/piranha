from graphene import Enum
from django.contrib import auth
from django.contrib.auth.models import Group
from seaport.models import User


class UserAccessLevel(Enum):
    NONE = 0
    MEMBER = 1
    EXEC = 2
    ADMIN = 3


class UserController:
    @classmethod
    def get_user(cls, info):
        if info.context.user.has_perm("seaport.view_user"):
            return info.context.user

    @classmethod
    def get_users(cls, info, where):
        if info.context.user.has_perm("seaport.view_user"):
            return auth.get_user_model().objects.filter(**where)

    @classmethod
    def update_user(cls, info, id, data):
        if info.context.user.has_perm("seaport.change_user"):
            query = User.objects.filter(id=id)

            new_data = {k: v for k, v in data.items() if k not in ["access_level"]}

            query.update(**new_data)
            user = query.first()

            if "access_level" not in data:
                return user

            member_group = Group.objects.get(name="member")
            exec_group = Group.objects.get(name="exec")
            admin_group = Group.objects.get(name="admin")

            if data["access_level"] == UserAccessLevel.NONE:
                user.groups.clear()
                user.is_staff = False
                user.is_superuser = False
            elif data["access_level"] == UserAccessLevel.MEMBER:
                user.groups.set([member_group])
                user.is_staff = False
                user.is_superuser = False
            elif data["access_level"] == UserAccessLevel.EXEC:
                user.groups.set([member_group, exec_group])
                user.is_staff = False
                user.is_superuser = False
            elif data["access_level"] == UserAccessLevel.ADMIN:
                user.groups.set([member_group, exec_group, admin_group])
                user.is_staff = True

            user.save()
            return user

    @classmethod
    def get_has_admin_access(cls, user):
        access_level = cls.get_user_access_level(user)
        return access_level == UserAccessLevel.ADMIN or access_level == UserAccessLevel.EXEC

    @classmethod
    def get_user_access_level(cls, user):
        if not user or not user.is_active:
            return UserAccessLevel.NONE

        groups = user.groups

        if groups.filter(name="admin").exists():
            return UserAccessLevel.ADMIN
        elif groups.filter(name="exec").exists():
            return UserAccessLevel.EXEC
        elif groups.filter(name="member").exists():
            return UserAccessLevel.MEMBER
        return UserAccessLevel.NONE

    @classmethod
    def get_ground_truth_id(cls, user):
        try:
            return user.social_auth.get(provider="ground_truth").uid
        except:
            return None

    @classmethod
    def get_full_name(cls, user):
        return user.full_name