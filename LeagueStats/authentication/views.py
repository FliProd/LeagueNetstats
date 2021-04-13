from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from .custom_permissions import IsPostOrIsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MyTokenObtainPairSerializer, ProfileSerializer, ValidationTokenSerializer
from .models import Profile, CustomUser, ValidationToken
from riotapi.models import Match, Event, Frame, NetworkLog
from django.shortcuts import get_object_or_404
import string
import random
from django.core.mail import send_mail


# add more context to jwt (favorite color in this case)
class ObtainTokenPairWithExtraInfo(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MyTokenObtainPairSerializer


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            print('blacklisted token')
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class Account(APIView):
    permission_classes = [IsPostOrIsAuthenticated]

    #TODO: make sure everything is encrypted
    def post(self, request, format='json'):
        profile_serializer = ProfileSerializer(data=request.data)
        if profile_serializer.is_valid():
            if self.checkUnique(request.data['user']['email']):
                profile = profile_serializer.save()
                if profile:
                    json = profile_serializer.data
                    #create email validation token
                    user_id = json['user_id']
                    letters = string.ascii_lowercase
                    token = ''.join(random.choice(letters) for i in range(50))

                    validation_token_serializer = ValidationTokenSerializer(data={'user': user_id, 'token': token})
                    if validation_token_serializer.is_valid() and validation_token_serializer.save():
                        #TODO: change link
                        send_mail(subject='Email Verification League Netstats',
                                  message='<h3> Verificate your Email </h3> '
                                  '<p>Please click on below link to verificate your email:</p>'
                                  '<href src=http://127.0.0.1:8000/api/accountVerification/' + token +'>',
                                  from_email='noreply@league-netstats.ethz.ch',
                                  recipient_list=[json['user']['email']],
                                  fail_silently=False)
                    else:
                        return Response(validation_token_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                    return Response(json, status=status.HTTP_201_CREATED)
            return Response({"user": {"email": ["user with this email address already exists."]}},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format='json'):
        profile = get_object_or_404(Profile, user_id=request.user.id)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            if self.checkUniqueNewEmail(profile.user.email, request.data['user']['email']):
                profile = serializer.update(instance=profile, validated_data=request.data)
                if profile:
                    json = serializer.data
                    return Response(json, status=status.HTTP_200_OK)
            return Response({"user": {"email": ["user with this email address already exists."]}},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        profile = get_object_or_404(Profile, user_id=request.user.id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def checkUnique(self, email):
        try:
            CustomUser.objects.get(email=email)
            return False
        except CustomUser.DoesNotExist:
            return True

    # make sure the new email address is uniqe
    def checkUniqueNewEmail(self, old_email, new_email):
        if (old_email != new_email):
            return self.checkUnique(email=new_email)
        return True


class ValidationTokenView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, token):

        saved_token = get_object_or_404(ValidationToken, token=token)

        profile = get_object_or_404(Profile, user_id=saved_token.user_id)
        serializer = ProfileSerializer(profile, partial=True)
        if serializer.update(instance=profile, validated_data={'verificated': True}):
            return Response({'verificated': True}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user_id = request.user.id

        profile = get_object_or_404(Profile, user_id=user_id)
        profile.delete()

        try:
            Profile.objects.filter(user_id=user_id).delete()
            Match.objects.filter(user_id=user_id).delete()
            Event.objects.filter(user_id=user_id).delete()
            Frame.objects.filter(user_id=user_id).delete()
            NetworkLog.objects.filter(user_id=user_id).delete()
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)






