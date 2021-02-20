from django.urls import path
from .views import Summoner, Match

urlpatterns = [
    path('summoner/<name>', Summoner.as_view(), name="summonerview"),
    path('match/create/', Match.as_view(), name="create_profile")
]
