from django_cassiopeia import cassiopeia as cass
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from datapipelines.common import NotFoundError
from .parser import parse_netlog, get_base_ingame_stats
import time
import json
from authentication.models import Profile
from django.shortcuts import get_object_or_404


class Summoner(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, name):

        possible_accounts = []

        for region in cass.data.Region:
            try:
                summoner = cass.Summoner(name=name, region=region)
                print(region)
                possible_accounts.append({
                    "name": name,
                    "puuid": summoner.puuid,
                    "account_id": summoner.account_id,
                    "region": region.__str__(),
                    "icon_id": summoner.profile_icon.id,
                    "level": summoner.level,
                })

            except NotFoundError:
                print('Notfounderror')
            except AttributeError:
                print('API Key Problems')

        if len(possible_accounts) > 0:
            return Response({"possible_accounts": possible_accounts}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


# TODO: safer way to load matches (with match_history API) because region might have changed
class Match(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        region = translateRegion(profile.game_region)
        summoner = cass.Summoner(account_id=profile.account_id, region=region)
        match_ids = json.loads(request.data['date_match_map'])

        for filename in request.FILES:
            # associate netlog with a match id
            netlog = request.FILES[filename]
            date = time.strptime(netlog.name, "%Y-%m-%dT%H-%M-%S_netlog.txt")
            match_date = netlog.name.replace('_netlog.txt', '');
            match_id = int(match_ids[match_date])

            # get match information from api via match_id
            match = cass.get_match(id=match_id, region=region)
            timeline_json = match.timeline

            netstats = parse_netlog(netlog)

            for participant in match.participants:
                if participant.summoner.name == summoner.name:
                    log_owner_id = participant.id
            timelines = get_base_ingame_stats(timeline_json, log_owner_id)

        return Response('ToDo')


def get(self, request, pk):
    return Response('ToDo')


def translateRegion(region):
    mapping = {'Region.brazil': 'BR',
               'Region.europe_north_east': 'EUN',
               'Region.europe_west': 'EUW',
               'Region.japan': 'JP',
               'Region.korea': 'KR',
               'Region.latin_america_north': 'LAN',
               'Region.latin_america_south': 'LAS',
               'Region.north_america': 'NA',
               'Region.oceania': 'OC',
               'Region.turkey': 'TR',
               'Region.russia': 'RU'}
    return mapping[region]
