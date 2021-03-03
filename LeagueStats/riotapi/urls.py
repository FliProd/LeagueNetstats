from django.urls import path
from .views import Summoner, MatchView

urlpatterns = [
    path('summoner/<name>', Summoner.as_view(), name="summonerview"),
    path('match/create/', MatchView.as_view(), name="create_match"),
    path('match/get/<pk>', MatchView.as_view(), name="get_match")
]


