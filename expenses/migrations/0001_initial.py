# Generated by Django 3.0.4 on 2020-03-19 19:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='FiscalYear',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('friendly_name', models.CharField(max_length=150, unique=True)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('archived', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Created at', models.DateTimeField(auto_now_add=True)),
                ('Updated at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=150)),
                ('archived', models.BooleanField(default=False)),
                ('fiscal_year',
                 models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='expenses.FiscalYear')),
                ('leads', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Requisition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Created at', models.DateTimeField(auto_now_add=True)),
                ('Updated at', models.DateTimeField(auto_now=True)),
                ('headline', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('status', models.CharField(
                    choices=[('Draft', 'Draft'), ('Submitted', 'Submitted'), ('Pending Changes', 'Pending Changes'),
                             ('Ready to Order', 'Ready to Order'), ('Ordered', 'Ordered'), ('Received', 'Received'),
                             ('Cancelled', 'Cancelled')], max_length=50)),
                ('point_of_contact',
                 models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='expenses.Project')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Vendor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Created at', models.DateTimeField(auto_now_add=True)),
                ('Updated at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=150, unique=True)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RequisitionItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('short_name', models.CharField(max_length=150)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('unit_price', models.DecimalField(decimal_places=4, max_digits=15)),
                ('requisition',
                 models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='expenses.Requisition')),
            ],
        ),
        migrations.AddField(
            model_name='requisition',
            name='vendor',
            field=models.ForeignKey(limit_choices_to={'is_active': True}, on_delete=django.db.models.deletion.PROTECT,
                                    to='expenses.Vendor'),
        ),
        migrations.CreateModel(
            name='Approval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approving', models.BooleanField()),
                ('notes', models.TextField()),
                ('approver',
                 models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
