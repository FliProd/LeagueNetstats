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
from django.shortcuts import redirect


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
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class Account(APIView):
    permission_classes = [IsPostOrIsAuthenticated]

    def post(self, request, format='json'):
        profile_serializer = ProfileSerializer(data=request.data)
        if profile_serializer.is_valid():
            if self.checkUnique(request.data['user']['email']):
                profile = profile_serializer.save()
                if profile:
                    json = profile_serializer.data
                    # create email validation token
                    if self.validateEmail(json['user_id'], json['user']['email']):
                        return Response(json, status=status.HTTP_201_CREATED)
                    else:
                        return Response('verification.error', status=status.HTTP_400_BAD_REQUEST)
            return Response({"user": {"email": ["user with this email address already exists."]}},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format='json'):
        profile = get_object_or_404(Profile, user_id=request.user.id)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        old_email = profile.user.email
        new_email = request.data['user']['email']
        if serializer.is_valid():
            if self.checkUniqueNewEmail(old_email, new_email):
                if old_email != new_email:
                    request.data['verificated'] = False
                profile = serializer.update(instance=profile, validated_data=request.data)
                if profile:
                    json = serializer.data
                    if old_email != new_email:
                        if self.validateEmail(json['user_id'], json['user']['email']):
                            json = serializer.data
                            return Response(json, status=status.HTTP_200_OK)
                        else:
                            return Response('verification.error', status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response(json, status=status.HTTP_200_OK)
                else:
                    return Response('serializer.error', status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"user": {"email": ["user with this email address already exists."]}},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response('serializer.error', status=status.HTTP_400_BAD_REQUEST)

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

    def validateEmail(self, user_id, user_email):
        letters = string.ascii_lowercase
        token = ''.join(random.choice(letters) for i in range(50))
        print(1)

        validation_token_serializer = ValidationTokenSerializer(data={'user': user_id, 'token': token})
        if validation_token_serializer.is_valid() and validation_token_serializer.save():
            print(2)
            send_mail(subject='Email Verification League Netstats',
                      message='Please click on the following link to verify your email for League Netstats https://league-netstats.ethz.ch/api/accountVerification/' + token,
                      from_email='noreply@league-netstats.ethz.ch',
                      recipient_list=[user_email],
                      fail_silently=False)
            return True
        else:
            print(validation_token_serializer.errors)
            return False

class ValidationTokenView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, token):

        try:
            saved_token = ValidationToken.objects.get(token=token)
            profile = Profile.objects.get(user_id=saved_token.user)
            serializer = ProfileSerializer(profile, partial=True)
            serializer.update(instance=profile, validated_data={'verificated': True})
            ValidationToken.objects.filter(user=saved_token.user).delete()
            return redirect('/')
        except ValidationToken.DoesNotExist:
            return redirect('/')
        except Profile.DoesNotExist:
            return redirect('/')



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
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)
