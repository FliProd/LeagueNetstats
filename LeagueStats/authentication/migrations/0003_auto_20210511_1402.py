# Generated by Django 3.1.5 on 2021-05-11 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20210402_0815'),
    ]

    operations = [
        migrations.AlterField(
            model_name='validationtoken',
            name='user',
            field=models.PositiveIntegerField(),
        ),
    ]