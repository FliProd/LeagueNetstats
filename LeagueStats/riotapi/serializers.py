from rest_framework import serializers
from .models import Match, NetworkLog, Event, Frame


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['user_id', 'match_id', 'queue_id', 'game_type', 'game_duration', 'platform_id', 'game_start',
                  'season_id', 'map_id', 'game_mode', 'participants']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['user_id', 'match_id', 'x', 'y', 'timestamp', 'active_participant', 'passive_participant', 'assisting_participants', 'type']


class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frame
        fields = ['user_id', 'match_id', 'timestamp', 'exp', 'gold', 'creep_score', 'neutral_score', 'level']


class NetworkLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkLog
        fields = ['user_id', 'match_id', 'time', 'ping', 'jitter', 'in_bandwidth', 'out_bandwidth', 'loss']
