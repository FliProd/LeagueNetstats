from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import Feedback

urlpatterns = [
    path('create/', Feedback.as_view(), name="create_feedback"),
]
