from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .serializers import Feedbackerializer
from rest_framework import status, permissions


class Feedback(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk, format=None):
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk, format=None):
        return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, format=None):
        return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, format=None):
        request.data['user_id'] = request.user.id
        serializer = Feedbackerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
