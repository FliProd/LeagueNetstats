from django.db import models
from authentication.models import CustomUser

# Create your models here.


class Feedback(models.Model):
    user_id = models.ForeignKey(to=CustomUser, db_column='user_id', on_delete=models.CASCADE)
    feedback = models.TextField()
