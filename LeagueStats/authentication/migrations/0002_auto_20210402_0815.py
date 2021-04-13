# Generated by Django 3.1.5 on 2021-04-02 08:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_customuser_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='verificated',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='ValidationToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=256)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='validation_token', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
