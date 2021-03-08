from django_cassiopeia import cassiopeia as cass
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from datapipelines.common import NotFoundError
from .parser import parse_netlog, parse_timeline, parse_match
import time
import json
from .models import Event, NetworkLog, Frame, Match
from .serializers import EventSerializer, NetworkLogSerializer, FrameSerializer, MatchSerializer
from authentication.models import Profile
from django.core import serializers
from django.shortcuts import get_object_or_404, get_list_or_404

types = {'CHAMPION_KILL': 'CK',
         'WARD_PLACED': 'WP',
         'WARD_KILL': 'WK',
         'BUILDING_KILL': 'BK',
         'ELITE_MONSTER_KILL': 'EK',
         'ITEM_PURCHASED': 'IP',
         'ITEM_SOLD': 'IS',
         'ITEM_DESTROYED': 'ID',
         'ITEM_UNDO': 'IU',
         'SKILL_LEVEL_UP': 'LU',
         'ASCENDED_EVENT': 'AE',
         'CAPTURE_POINT': 'CP',
         'PORO_KING_SUMMON': 'PS'}


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
class MatchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        region = translateRegion(profile.game_region)
        summoner = cass.Summoner(account_id=profile.account_id, region=region)
        match_ids = json.loads(request.data['date_match_map'])
        user_id = request.user.id

        response = {
            'errors': [],
            'successes': [],
        }

        for filename in request.FILES:

            netlog = request.FILES[filename]
            date = time.strptime(netlog.name, "%Y-%m-%dT%H-%M-%S_netlog.txt")
            match_date = netlog.name.replace('_netlog.txt', '');
            match_id = int(match_ids[match_date])

            match = cass.get_match(id=match_id, region=region)
            timeline_json = match.timeline

            log_owner_id = 0
            for participant in match.participants:
                if participant.summoner.name == summoner.name:
                    log_owner_id = participant.id

            netstats = parse_netlog(netlog, match_id, user_id)
            match_to_save = parse_match(match, user_id)
            [frames, events] = parse_timeline(timeline_json, log_owner_id, match_id, user_id)

            matchserializer = MatchSerializer(data=match_to_save)
            netlogserializer = NetworkLogSerializer(data=netstats, many=True)
            eventserializer = EventSerializer(data=events, many=True)
            frameserializer = FrameSerializer(data=frames, many=True)

            valid = True
            valid &= matchserializer.is_valid()
            valid &= netlogserializer.is_valid()
            valid &= eventserializer.is_valid()
            valid &= frameserializer.is_valid()

            if valid:
                match = matchserializer.save()
                netlogs = netlogserializer.save()
                events = eventserializer.save()
                frames = frameserializer.save()

                if match and netlogs and events and frames:
                    response['successes'].append(match_date)
            else:
                errors = {
                    'matchserializer': matchserializer.errors,
                    'netlogserializer': netlogserializer.errors,
                    'eventserializer': eventserializer.errors,
                    'frameserializer': frameserializer.errors,

                }
                response['errors'].append(errors)

        if len(response['successes']) > 0:
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        user_id = request.user.id
        match_id = pk

        try:

            match = Match.objects.get(match_id=match_id, user_id=user_id)
            match = MatchSerializer(match).data

            events = list(Event.objects.filter(match_id=match_id, user_id=user_id).order_by('timestamp'))
            events = json.dumps(EventSerializer(events, many=True).data)

            frames = list(Frame.objects.filter(match_id=match_id, user_id=user_id).order_by('timestamp'))
            frames = json.dumps(FrameSerializer(frames, many=True).data)

            networklogs = list(NetworkLog.objects.filter(match_id=match_id, user_id=user_id).order_by('time'))
            networklogs = json.dumps(NetworkLogSerializer(networklogs, many=True).data)

            return Response({'match': match,
                             'events': events,
                             'frames': frames,
                             'networklogs': networklogs
                             })

        except (Match.DoesNotExist, Event.DoesNotExist, Frame.DoesNotExist, NetworkLog.DoesNotExist) as e:
            print(e)
            return Response(status=status.HTTP_404_NOT_FOUND)


def translateRegion(region):
    mapping = {'Region.brazil': 'BR',
               'Region.europe_north_east': 'EUNE',
               'Region.europe_west': 'EUW',
               'Region.japan': 'JP',
               'Region.korea': 'KR',
               'Region.latin_america_north': 'LAN',
               'Region.latin_america_south': 'LAS',
               'Region.north_america': 'NA',
               'Region.oceania': 'OCE',
               'Region.turkey': 'TR',
               'Region.russia': 'RU'}
    return mapping[region]


class MatchesByUserId(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        matches = Match.objects.filter(user_id=request.user.id).order_by('game_start').reverse()

        match_ids = []
        for match in matches:
            match_ids.append(match.match_id)

        return Response({'match_ids': match_ids}, status=status.HTTP_200_OK)

