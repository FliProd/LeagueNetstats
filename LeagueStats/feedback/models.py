from django.db import models
from authentication.models import CustomUser

# Create your models here.


class Feedback(models.Model):
    email = models.EmailField()
    feedback = models.TextField()
