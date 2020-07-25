# Generated by Django 3.0.7 on 2020-07-24 23:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0029_requisition_is_reimbursement'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentmethod',
            name='reimbursement_instructions',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='requisition',
            name='status',
            field=models.CharField(choices=[('Draft', 'Draft'), ('Submitted', 'Submitted'), ('Pending Changes', 'Pending Changes'), ('Ready to Order', 'Ready to Order'), ('Ordered', 'Ordered'), ('Partially Received', 'Partially Received'), ('Received', 'Received'), ('Closed', 'Closed'), ('Cancelled', 'Cancelled'), ('Ready for Reimbursement', 'Ready for Reimbursement'), ('Reimbursement in Progress', 'Reimbursement in Progress')], default='Draft', max_length=50),
        ),
    ]
