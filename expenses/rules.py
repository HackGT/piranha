import rules
from rules import is_group_member


# REQUISITION PERMISSIONS

@rules.predicate
def requisition_is_unlocked(user, rek):
    if not rek:
        return None
    return rek.status in ["Draft", "Pending Changes"]


@rules.predicate
def can_edit_unlocked_requisition(user, rek):
    if not rek:
        return None
    return user == rek.created_by or can_edit_locked_requisition(user, rek)


@rules.predicate
def can_edit_locked_requisition(user, rek):
    if not rek:
        return None
    return is_exec(user) or is_project_lead(user, rek)


# ACCESS PERMISSIONS

@rules.predicate
def is_member(user):
    return is_group_member("member")(user)


@rules.predicate
def is_exec(user):
    return is_group_member("exec")(user) or is_group_member("admin")(user)


@rules.predicate
def is_admin(user):
    return is_group_member("admin")(user)


@rules.predicate
def is_project_lead(user, rek):
    return user in rek.project.leads.all()
