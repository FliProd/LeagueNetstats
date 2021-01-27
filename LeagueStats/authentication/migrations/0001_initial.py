# Generated by Django 3.1.5 on 2021-01-27 15:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('puuid', models.CharField(max_length=512)),
                ('game_region', models.CharField(max_length=512)),
                ('city', models.CharField(max_length=1024)),
                ('state', models.CharField(max_length=1024)),
                ('country', models.CharField(max_length=1024)),
                ('zipcode', models.PositiveIntegerField()),
                ('level', models.PositiveIntegerField()),
                ('icon_id', models.PositiveIntegerField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
