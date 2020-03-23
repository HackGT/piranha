# Generated by Django 3.0.4 on 2020-04-29 04:47

import django.utils.timezone
import rules.contrib.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('expenses', '0007_auto_20200323_2259'),
    ]

    operations = [
        migrations.CreateModel(
            name='PaymentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('friendly_name', models.CharField(max_length=150, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='approval',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='approval',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='requisition',
            name='created_by',
            field=models.ForeignKey(default='5c378d5f-ac7a-493b-b998-a527d6a9000c',
                                    on_delete=django.db.models.deletion.PROTECT, related_name='created_by',
                                    related_query_name='created_by', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='requisition',
            name='payment_required_by',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='requisition',
            name='point_of_contact',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='point_of_contact',
                                    related_query_name='point_of_contact', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('recipient_object_id', models.CharField(max_length=150)),
                ('amount', models.DecimalField(decimal_places=4, max_digits=15)),
                ('funding_source',
                 models.ForeignKey(limit_choices_to={'is_active': True}, on_delete=django.db.models.deletion.PROTECT,
                                   to='expenses.PaymentType')),
                ('recipient_type',
                 models.ForeignKey(limit_choices_to={'is_active': True}, on_delete=django.db.models.deletion.PROTECT,
                                   to='contenttypes.ContentType')),
                ('requisition',
                 models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='expenses.Requisition')),
            ],
            options={
                'abstract': False,
            },
            bases=(rules.contrib.models.RulesModelMixin, models.Model),
        ),
    ]