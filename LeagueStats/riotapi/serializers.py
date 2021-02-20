from rest_framework import serializers
from .models import Match, NetworkLog, MatchTimeline

class MatchSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        return 0

class MatchTimeLineSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        return 0

class NetworkLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = NetworkLog
        fields = ['match_id', 'time', 'ping', 'jitter', 'in_bandwidth', 'out_bandwidth', 'loss']
