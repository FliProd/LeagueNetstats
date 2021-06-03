from rest_framework import serializers
from .models import Feedback


class Feedbackerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['email', 'feedback']
