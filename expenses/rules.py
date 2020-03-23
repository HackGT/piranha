import rules
from rules import is_group_member


@rules.predicate
def is_requisition_point_of_contact(user, rek):
    return rek.point_of_contact == user


@rules.predicate
def requisition_is_unlocked(user, rek):
    if not rek:
        return None
    return rek.status in ["Draft", "Pending Changes"]


@rules.predicate
def is_exec(user):
    return is_group_member("exec")(user)


@rules.predicate
def can_edit_unlocked_requisition(user, rek):
    if not rek:
        return None
    return user == rek.point_of_contact or can_edit_locked_requisition(user, rek)


@rules.predicate
def can_edit_locked_requisition(user, rek):
    if not rek:
        return None
    return is_exec(user) or user in rek.project.leads.all()


@rules.predicate
def is_member(user):
    return is_group_member("member")(user)