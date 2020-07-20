# Generated by Django 3.0.7 on 2020-07-20 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0026_auto_20200715_2306'),
    ]

    operations = [
        migrations.AlterField(
            model_name='requisition',
            name='status',
            field=models.CharField(choices=[('Draft', 'Draft'), ('Submitted', 'Submitted'), ('Pending Changes', 'Pending Changes'), ('Ready to Order', 'Ready to Order'), ('Ordered', 'Ordered'), ('Partially Received', 'Partially Received'), ('Received', 'Received'), ('Closed', 'Closed'), ('Cancelled', 'Cancelled')], default='Draft', max_length=50),
        ),
    ]
