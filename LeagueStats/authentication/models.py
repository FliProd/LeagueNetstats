from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_cassiopeia import cassiopeia as cass


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    puuid = models.CharField(max_length=512)
    game_region = models.CharField(max_length=512)
    city = models.CharField(max_length=1024)
    state = models.CharField(max_length=1024)
    country = models.CharField(max_length=1024)
    zipcode = models.PositiveIntegerField()
    level = models.PositiveIntegerField()
    icon_id = models.PositiveIntegerField()


