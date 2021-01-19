from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    extra_info = models.CharField(blank=True, max_length=120)
