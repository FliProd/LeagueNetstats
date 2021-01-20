from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_cassiopeia import cassiopeia as cass
from geopy.geocoders import Nominatim


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    puuid = models.CharField(max_length=512)
    game_region = models.CharField(max_length=512)
    location = models.TextField(max_length=512)


