from django.urls import path
from .views import Summoner

urlpatterns = [
    path('summoner/<name>', Summoner.as_view(), name="summonerview"),
]
