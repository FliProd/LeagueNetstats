from django.db import models
from django.contrib.postgres.fields import ArrayField
from authentication.models import CustomUser


class Match(models.Model):
    user_id = models.ForeignKey(to=CustomUser, db_column='user_id', on_delete=models.CASCADE)
    match_id = models.PositiveIntegerField()
    queue_id = models.CharField(max_length=32)
    game_type = models.CharField(max_length=64)
    game_duration = models.BigIntegerField()
    platform_id = models.CharField(max_length=8)
    game_start = models.BigIntegerField()
    season_id = models.CharField(max_length=32)
    map_id = models.PositiveSmallIntegerField()
    game_mode = models.CharField(max_length=64)
    teams = models.TextField()

    class Meta:
        unique_together = ('user_id', 'match_id')


class NetworkLog(models.Model):
    match_id = models.PositiveIntegerField()
    user_id = models.ForeignKey(to=CustomUser, db_column='user_id', on_delete=models.CASCADE)
    time = models.IntegerField()
    ping = models.IntegerField()
    jitter = models.IntegerField()
    in_bandwidth = models.FloatField()
    out_bandwidth = models.FloatField()
    loss = models.FloatField()


class Event(models.Model):
    match_id = models.PositiveIntegerField()
    user_id = models.ForeignKey(to=CustomUser, db_column='user_id', on_delete=models.CASCADE)
    timestamp = models.PositiveBigIntegerField()
    x = models.PositiveIntegerField()
    y = models.PositiveIntegerField()
    active_participant = models.CharField(blank=True, null=True, max_length=64)
    passive_participant = models.CharField(blank=True, null=True, max_length=64)
    assisting_participants = ArrayField(models.PositiveIntegerField(), blank=True, null=True)
    type = models.CharField(max_length=32)


class Frame(models.Model):
    match_id = models.PositiveIntegerField()
    user_id = models.ForeignKey(to=CustomUser, db_column='user_id', on_delete=models.CASCADE)
    timestamp = models.PositiveIntegerField()
    exp = models.PositiveIntegerField()
    gold = models.IntegerField()
    creep_score = models.IntegerField()
    neutral_score = models.IntegerField()
    level = models.IntegerField()
