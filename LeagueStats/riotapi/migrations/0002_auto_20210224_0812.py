# Generated by Django 3.1.5 on 2021-02-24 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('riotapi', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='active_participant',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='passive_participant',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
    ]
