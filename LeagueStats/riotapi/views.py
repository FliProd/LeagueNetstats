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
from pprint import pprint

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


class MatchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user_id = request.user.id
        summoner_name = request.user.username

        match_id = int(json.loads(request.data['match_id']))
        match_region = translateRegionR3(json.loads(request.data['region']))

        netlog = request.FILES['netlog']
        match = cass.get_match(id=match_id, region=match_region)
        timeline_json = match.timeline

        try:
            log_owner_id = -1
            participants = []
            for participant in match.participants:
                # sometimes participantidentities arent saved see match 942186746
                print(participant.summoner)
                if participant.summoner is not None:
                    participants.append(participant.summoner.name)
                    if str(participant.summoner.name).casefold() == str(summoner_name).casefold():
                        log_owner_id = participant.id
                elif log_owner_id == -1:
                    # sometimes API returns none for the summoners of a match, this is a flag for that
                    log_owner_id = -2

            if not (log_owner_id == -1 or log_owner_id == -2):
                netstats = parse_netlog(netlog, match_id, user_id)
                match_to_save = parse_match(match, user_id)
                [frames, events] = parse_timeline(timeline_json, log_owner_id, match_id, user_id)

                if match_to_save and netstats and frames and events:
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
                            return Response(str(match_id) + ' success', status=status.HTTP_200_OK)
                    else:
                        errors = {
                            'matchserializer': matchserializer.errors,
                            'netlogserializer': netlogserializer.errors,
                            'eventserializer': eventserializer.errors,
                            'frameserializer': frameserializer.errors,

                        }
                        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response('upload.parsing_error', status=status.HTTP_400_BAD_REQUEST)
            elif log_owner_id == -1:
                return Response('upload.participant_not_in_json', status=status.HTTP_400_BAD_REQUEST)
            elif log_owner_id == -2:
                return Response('upload.no_summoners_in_json', status=status.HTTP_400_BAD_REQUEST)
        except NotFoundError:
            return Response('upload.not_found', status=status.HTTP_400_BAD_REQUEST)

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


def translateRegionR3(region):
    mapping = {'BR1': 'BR',
               'EUN1': 'EUNE',
               'EUW1': 'EUW',
               'JP1': 'JP',
               'KR': 'KR',
               'LA1': 'LAN',
               'LA2': 'LAS',
               'NA1': 'NA',
               'OC1': 'OCE',
               'TR1': 'TR',
               'RU1': 'RU'}
    return mapping[region]


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


class MatchListByUser(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, start):
        matches = Match.objects.filter(user_id=request.user.id).order_by('game_start').reverse()[int(start):int(start) + 10]
        matches = MatchSerializer(matches, many=True).data

        return Response({'matches': matches}, status=status.HTTP_200_OK)
