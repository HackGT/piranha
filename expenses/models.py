from django.contrib import auth
from django.contrib.contenttypes.models import ContentType
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
    description = TextField(blank=True)
    status = CharField(choices=RequisitionStatus.choices, max_length=50, default=RequisitionStatus.DRAFT)
    created_by = ForeignKey(auth.get_user_model(), on_delete=models.PROTECT, related_name="created_by",
                            related_query_name="created_by")
    project = ForeignKey('Project', on_delete=models.CASCADE)
    vendor = ForeignKey('Vendor', on_delete=models.PROTECT, limit_choices_to={"is_active": True}, null=True, blank=True)
    project_requisition_id = PositiveIntegerField()
    payment_required_by = DateTimeField(null=True, blank=True)
    other_fees = DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)

    class Meta:
        rules_permissions = {
            "add": is_member,
            "change": (requisition_is_unlocked & can_edit_unlocked_requisition) | (
                    ~requisition_is_unlocked & can_edit_locked_requisition),
            "view": is_member,
            "delete": is_exec
        }

    @property
    def reference_string(self):
        return "{}-{}-{:02}".format(self.project.year, self.project.short_code,
                                    self.project_requisition_id)

    def __str__(self):
        return self.reference_string


class RequisitionItem(models.Model):
    name = CharField(max_length=150, blank=True)
    requisition = ForeignKey('Requisition', on_delete=models.CASCADE)
    quantity = PositiveIntegerField(null=True, blank=True)
    unit_price = DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)
    link = URLField(blank=True)
    notes = TextField(blank=True)

    def __str__(self):
        return self.name


class Project(TimestampedModel):
    name = CharField(max_length=150)
    archived = BooleanField(default=False)
    leads = ManyToManyField('seaport.User')
    short_code = CharField(max_length=25, help_text="A short, 2-5 character code to represent this project")
    year = PositiveIntegerField()

    @property
    def reference_string(self):
        return "{}-{}".format(self.year, self.short_code)

    def __str__(self):
        return "{} ({})".format(self.name, self.year)


class Approval(TimestampedModel):
    is_approving = BooleanField(null=True)
    notes = TextField()
    approver = ForeignKey(auth.get_user_model(), on_delete=models.PROTECT)
    requisition = ForeignKey('Requisition', on_delete=models.CASCADE)


class Vendor(TimestampedModel):
    name = CharField(max_length=150, unique=True)
    is_active = BooleanField(default=True)

    def __str__(self):
        return self.name


class PaymentMethod(models.Model):
    friendly_name = CharField(max_length=150, unique=True)
    is_active = BooleanField(default=True)

    def __str__(self):
        return self.friendly_name


class Payment(TimestampedModel):
    requisition = ForeignKey('Requisition', on_delete=models.CASCADE)
    recipient = ForeignKey('Vendor', on_delete=models.PROTECT)
    amount = DecimalField(max_digits=15, decimal_places=4)
    funding_source = ForeignKey('PaymentMethod', on_delete=models.PROTECT, limit_choices_to={"is_active": True})
    date = DateField()

    def __str__(self):
        return "{} from {} to {} on {}".format(self.amount, self.funding_source, self.recipient.name, self.date)
