from django.urls import path
from .views import Summoner

urlpatterns = [
    path('summoner/', Summoner.as_view(), name="summonerview"),
]
