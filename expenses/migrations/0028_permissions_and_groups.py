# Generated by Django 3.0.7 on 2020-07-23 03:15

from django.db import migrations


def apply_migration(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Permission = apps.get_model('auth', 'Permission')

    admin = Group.objects.get_or_create(name="admin")[0]
    for permission in Permission.objects.all():
        admin.permissions.add(permission)

    Group.objects.bulk_create([
        Group(name='exec'),
        Group(name='member')
    ], ignore_conflicts=True)


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0027_auto_20200720_1213'),
    ]

    operations = [
        migrations.RunPython(apply_migration)
    ]
