# Generated by Django 3.0.4 on 2020-03-18 22:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('seaport', '0002_user_preferred_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='preferred_name',
            field=models.CharField(blank=True, max_length=30, verbose_name='preferred name'),
        ),
    ]
