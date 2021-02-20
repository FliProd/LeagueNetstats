from django.db import models
from django.contrib.postgres.fields import ArrayField
from authentication.models import CustomUser


class Match(models.Model):
    email = models.ForeignKey(to_field=CustomUser.email, on_delete=models.CASCADE())
    match_id = models.PositiveIntegerField(unique=True)
    match_json = models.TextField()


class NetworkLog(models.Model):
    match_id = models.ForeignKey(to_field=Match.match_id, on_delete=models.CASCADE)
    time = ArrayField(models.IntegerField)
    ping = ArrayField(models.IntegerField)
    jitter = ArrayField(models.IntegerField)
    in_bandwidth = ArrayField(models.FloatField)
    out_bandwid = ArrayField(models.FloatField)
    loss = ArrayField(models.FloatField)


class Timeline(models.Model):
    match_id = models.ForeignKey(to_field=Match.match_id, on_delete=models.CASCADE)
    champion_kills = ArrayField(models.CharField())
