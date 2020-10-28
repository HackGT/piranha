from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import CharField, PositiveIntegerField, DecimalField, ForeignKey, TextChoices


class BudgetGroup(models.Model):
    name = CharField(max_length=150)

    def __str__(self):
        return self.name


class Budget(models.Model):
    name = CharField(max_length=150)
    group = ForeignKey('BudgetGroup', on_delete=models.PROTECT)

    def __str__(self):
        return "{} ({})".format(self.name, self.group.name)


class Category(models.Model):
    name = CharField(max_length=150)
    budget = ForeignKey('Budget', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.budget.name})"


class LineItem(models.Model):
    name = CharField(max_length=150)
    quantity = PositiveIntegerField()
    unit_cost = DecimalField(max_digits=15, decimal_places=4)
    category = ForeignKey('Category', on_delete=models.CASCADE)

    def __str__(self):
        return "{} ({})".format(self.name, self.category)


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

    def __str__(self):
        return "{} {}".format(self.month, self.year)


class OperatingLineItem(models.Model):
    name = CharField(max_length=150)
    cost = DecimalField(max_digits=15, decimal_places=4)
    operating_budget = ForeignKey('OperatingBudget', on_delete=models.CASCADE)

    def __str__(self):
        return "{} ({})".format(self.name, self.operating_budget)
