# Generated by Django 3.1.5 on 2021-02-18 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='city',
            field=models.CharField(blank=True, max_length=1024),
        ),
        migrations.AlterField(
            model_name='profile',
            name='country',
            field=models.CharField(blank=True, max_length=1024),
        ),
        migrations.AlterField(
            model_name='profile',
            name='state',
            field=models.CharField(blank=True, max_length=1024),
        ),
        migrations.AlterField(
            model_name='profile',
            name='zipcode',
            field=models.PositiveIntegerField(blank=True),
        ),
    ]