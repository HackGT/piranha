from django.db import models
# Create your models here.
from django.db.models import CharField, ForeignKey, DateTimeField, BooleanField, DateField, TextField, ManyToManyField, \
    PositiveIntegerField, DecimalField, URLField
from rules.contrib.models import RulesModelMixin, RulesModelBase

from expenses.rules import is_member, requisition_is_unlocked, can_edit_locked_requisition, is_exec, \
    can_edit_unlocked_requisition


class TimestampedModel(RulesModelMixin, models.Model, metaclass=RulesModelBase):
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class RequisitionStatus(models.Model):
    DRAFT = "Draft"
    SUBMITTED = "Submitted"
    PENDING_CHANGES = "Pending Changes"
    READY_TO_ORDER = "Ready to Order"
    ORDERED = "Ordered"
    RECEIVED = "Received"
    CANCELLED = "Cancelled"

    choices = [(DRAFT, DRAFT),
               (SUBMITTED, SUBMITTED),
               (PENDING_CHANGES, PENDING_CHANGES),
               (READY_TO_ORDER, READY_TO_ORDER),
               (ORDERED, ORDERED),
               (RECEIVED, RECEIVED),
               (CANCELLED, CANCELLED)
               ]

    class Meta:
        abstract = True


class Requisition(TimestampedModel):
    headline = CharField(max_length=150)
    description = TextField()
    status = CharField(choices=RequisitionStatus.choices, max_length=50)
    point_of_contact = ForeignKey('seaport.User', on_delete=models.PROTECT)
    # TODO: add creator field
    project = ForeignKey('Project', on_delete=models.CASCADE)
    vendor = ForeignKey('Vendor', on_delete=models.PROTECT, limit_choices_to={"is_active": True})
    project_requisition_id = PositiveIntegerField()

    class Meta:
        rules_permissions = {
            "add": is_member,
            "change": (requisition_is_unlocked & can_edit_unlocked_requisition) | (
                        ~requisition_is_unlocked & can_edit_locked_requisition),
            "view": is_member,
            "delete": is_exec
        }

    @property
    def reference_id(self):
        return "{}-{}-{:02}".format(self.project.fiscal_year.short_code, self.project.short_code,
                                    self.project_requisition_id)

    def __str__(self):
        return self.reference_id


class RequisitionItem(models.Model):
    short_name = CharField(max_length=150)
    requisition = ForeignKey('Requisition', on_delete=models.CASCADE)
    quantity = PositiveIntegerField(default=1)
    unit_price = DecimalField(max_digits=15, decimal_places=4)
    link = URLField()
    notes = TextField()


class Project(TimestampedModel):
    name = CharField(max_length=150)
    fiscal_year = ForeignKey('FiscalYear', on_delete=models.PROTECT)
    archived = BooleanField(default=False)
    leads = ManyToManyField('seaport.User')
    short_code = CharField(max_length=25, help_text="A short, 2-5 character code to represent this project")

    def __str__(self):
        return "{} ({})".format(self.name, self.fiscal_year)


class FiscalYear(models.Model):
    friendly_name = CharField(max_length=150, unique=True)
    start_date = DateField()
    end_date = DateField(help_text="The year of the end date will be used to abbreviate this fiscal year in requisition \
    reference IDs")
    archived = BooleanField(default=False)

    @property
    def short_code(self):
        return self.end_date.year

    def __str__(self):
        return self.friendly_name


class Approval(models.Model):
    is_approving = BooleanField(null=True)
    notes = TextField()
    approver = ForeignKey('seaport.User', on_delete=models.PROTECT)
    requisition = ForeignKey('Requisition', on_delete=models.CASCADE)


class Vendor(TimestampedModel):
    name = CharField(max_length=150, unique=True)
    is_active = BooleanField(default=True)

    def __str__(self):
        return self.name
