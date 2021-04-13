from django.urls import path
from .views import Summoner, MatchView, MatchesByUserId, MatchListByUser

urlpatterns = [
    path('summoner/<name>', Summoner.as_view(), name="summonerview"),
    path('match/create/', MatchView.as_view(), name="create_match"),
    path('matchlist/get/<start>', MatchListByUser.as_view(), name="get_matchlist"),
    path('match/get/<pk>', MatchView.as_view(), name="get_match"),
    path('matches/get/', MatchesByUserId.as_view(), name="get_matches"),
]


