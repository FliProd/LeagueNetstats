from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, permissions
from .custom_permissions import IsPostOrIsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MyTokenObtainPairSerializer, ProfileSerializer
from .models import Profile, CustomUser
from django.shortcuts import get_object_or_404


# add more context to jwt (favorite color in this case)
class ObtainTokenPairWithExtraInfo(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MyTokenObtainPairSerializer


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
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
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            if self.checkUnique(request.data['user']['email']):
                profile = serializer.save()
                if profile:
                    json = serializer.data
                    return Response(json, status=status.HTTP_201_CREATED)
            return Response({"user": {"email": ["user with this email address already exists."]}},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

