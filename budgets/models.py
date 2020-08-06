from django.db import models
from django.db.models import CharField, PositiveIntegerField, DecimalField, ForeignKey, TextChoices
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType


class BudgetGroup(models.Model):
    name = CharField(max_length=150)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = CharField(max_length=150)
    budget_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    budget_object_id = models.PositiveIntegerField()
    budget = GenericForeignKey('budget_content_type', 'budget_object_id')

    def __str__(self):
        return self.name


class Budget(models.Model):
    name = CharField(max_length=150)
    group = ForeignKey('BudgetGroup', on_delete=models.PROTECT)
    categories = GenericRelation(Category, content_type_field="budget_content_type", object_id_field="budget_object_id")

    def __str__(self):
        return "{} ({})".format(self.name, self.group.name)


class Month(TextChoices):
    JANUARY = "JANUARY"
    FEBRUARY = "FEBRUARY"
    MARCH = "MARCH"
    APRIL = "APRIL"
    MAY = "MAY"
    JUNE = "JUNE"
    JULY = "JULY"
    AUGUST = "AUGUST"
    SEPTEMBER = "SEPTEMBER"
    OCTOBER = "OCTOBER"
    NOVEMBER = "NOVEMBER"
    DECEMBER = "DECEMBER"


class OperatingBudget(models.Model):
    month = models.CharField(choices=Month.choices, max_length=20)
    year = PositiveIntegerField()
    categories = GenericRelation(Category, content_type_field="budget_content_type", object_id_field="budget_object_id")

    def __str__(self):
        return "{} {}".format(self.month, self.year)


class LineItem(models.Model):
    name = CharField(max_length=150)
    quantity = PositiveIntegerField()
    unit_cost = DecimalField(max_digits=15, decimal_places=4)
    category = ForeignKey('Category', on_delete=models.CASCADE)

    def __str__(self):
        return "{} ({})".format(self.name, self.category)