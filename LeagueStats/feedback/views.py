from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .serializers import Feedbackerializer
from rest_framework import status, permissions
from django.core.mail import send_mail
from authentication.models import CustomUser

class Feedback(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk, format=None):
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk, format=None):
        return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, format=None):
        return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, format=None):
        print(request.data)
        if request.data['email'] == '':
            try:
                user = CustomUser.objects.get(id=request.user.id)
                email = user.email
                request.data['email'] = email
            except CustomUser.DoesNotExist:
                return Response({'email': 'feedback.email_missing'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            email = request.data['email']
        serializer = Feedbackerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            send_mail(subject='New Feedback',
                      message='Feedback from user with email: ' + email + '\n\n' + request.data['feedback'],
                      from_email='noreply@league-netstats.ethz.ch',
                      recipient_list=['noah.hampp@gmail.com'],
                      fail_silently=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
