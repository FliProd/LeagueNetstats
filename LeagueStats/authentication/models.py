from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_cassiopeia import cassiopeia as cass
from pgcrypto import fields


# change email to be unique and username to not be unique
# TODO: change user id to be random
class CustomUser(AbstractUser):

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def natural_key(self):
        return dict(email=self.email)


CustomUser._meta.get_field('email')._unique = True
CustomUser._meta.get_field('email')._blank = False
CustomUser._meta.get_field('username')._unique = False


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')

    verificated = models.BooleanField(default=False)

    puuid = fields.CharPGPSymmetricKeyField(max_length=512)
    account_id = fields.CharPGPSymmetricKeyField(max_length=512)
    game_region = models.CharField(max_length=512)
    level = models.PositiveIntegerField()
    icon_id = models.PositiveIntegerField()

    city = fields.CharPGPSymmetricKeyField(max_length=1024, blank=True)
    state = fields.CharPGPSymmetricKeyField(max_length=1024, blank=True)
    country = fields.CharPGPSymmetricKeyField(max_length=1024, blank=True)
    zipcode = fields.IntegerPGPSymmetricKeyField(blank=True)


class ValidationToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='validation_token')
    token = models.CharField(max_length=256)
