from __future__ import unicode_literals
from django.contrib.postgres.operations import CryptoExtension
from django.db import migrations


class Migration(migrations.Migration):

    # dependencies = [
    #     ('authentication', '__init__'),
    # ]

    operations = [
        CryptoExtension(),
    ]
