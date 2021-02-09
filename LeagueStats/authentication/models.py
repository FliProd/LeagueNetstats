from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django_cassiopeia import cassiopeia as cass

#change email to be unique and username to not be unique
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

    puuid = models.CharField(max_length=512)
    game_region = models.CharField(max_length=512)
    level = models.PositiveIntegerField()
    icon_id = models.PositiveIntegerField()

    city = models.CharField(max_length=1024, blank=True)
    state = models.CharField(max_length=1024, blank=True)
    country = models.CharField(max_length=1024, blank=True)
    zipcode = models.PositiveIntegerField(blank=True)



