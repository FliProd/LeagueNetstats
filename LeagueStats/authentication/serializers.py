from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.auth.models import User
from .models import Profile, CustomUser


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        return token


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'email': {
                 'validators': [UnicodeUsernameValidator()],
            }
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username')
        instance.email = validated_data.get('email')
        if validated_data.get('password') is not None:
            instance.set_password(validated_data.get('password'))
        instance.save()
        return instance


class ProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ('user', 'puuid', 'account_id', 'game_region', 'city', 'country', 'state', 'zipcode', 'level', 'icon_id')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = CustomUserSerializer()
        user = user_serializer.create(validated_data=user_data)
        profile = self.Meta.model(user=user, **validated_data)
        profile.save()
        return profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        user_serializer = CustomUserSerializer()
        user_serializer.update(instance=user, validated_data=user_data)

        instance.puuid = validated_data.get('puuid')
        instance.account_id = validated_data.get('account_id')
        instance.level = validated_data.get('level')
        instance.game_region = validated_data.get('game_region')
        instance.icon_id = validated_data.get('icon_id')
        instance.country = validated_data.get('country')
        instance.state = validated_data.get('state')
        instance.city = validated_data.get('city')
        instance.zipcode = validated_data.get('zipcode')
        instance.save()
        return instance