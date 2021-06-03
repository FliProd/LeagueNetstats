from riotwatcher import LolWatcher, ApiError
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
import os
import requests
import time

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

        lol_watcher = LolWatcher(os.environ.get("RIOT_API_KEY"))
        regions = ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'tr1', 'ru']

        for region in regions:
            try:
                summoner = lol_watcher.summoner.by_name(region=region, summoner_name=name)
                possible_accounts.append({
                    "name": name,
                    "puuid": summoner['puuid'],
                    "account_id": summoner['accountId'],
                    "region": translateRegion(region),
                    "icon_id": summoner['profileIconId'],
                    "level": summoner['summonerLevel'],
                })

            except AttributeError:
                print('API Key Problems')
            except requests.exceptions.ConnectionError as ex:
                print(ex)
            except ApiError as err:
                if err.response.status_code == 429:
                    print('too many requests')
                elif err.response.status_code == 404:
                    print('No Summoner with that name')

        if len(possible_accounts) > 0:
            return Response({"possible_accounts": possible_accounts}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class MatchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user_id = request.user.id
        summoner_name = request.user.username
        netlog = request.FILES['netlog']

        match_id = int(json.loads(request.data['match_id']))
        match_region = translateRegionR3(json.loads(request.data['region']))

        try:
            lol_watcher = LolWatcher(os.environ.get("RIOT_API_KEY"))

            match = lol_watcher.match.by_id(match_id=match_id, region=match_region)
            timeline_json = lol_watcher.match.timeline_by_match(match_id=match_id, region=match_region)

            log_owner_id = -1
            participants = []

            try:
                for participant in match['participantIdentities']:
                    participant_name = participant['player']['summonerName']
                    participants.append(participant_name)
                    if str(participant_name).casefold() == str(summoner_name).casefold():
                        log_owner_id = participant['participantId']

            except KeyError:
                print(match_id)
                return Response('upload.no_summoners_in_json', status=status.HTTP_400_BAD_REQUEST)

            if not log_owner_id == -1:
                netstats = parse_netlog(netlog, match_id, user_id)
                match_to_save = parse_match(match, user_id, summoner_name)
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
                            return Response('error while saving', status=status.HTTP_400_BAD_REQUEST)
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
        except requests.exceptions.HTTPError:
            return Response('upload.httperror', status=status.HTTP_400_BAD_REQUEST)

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
    mapping = {'BR1': 'br1',
               'EUN1': 'eun1',
               'EUW1': 'euw1',
               'JP1': 'jp1',
               'KR': 'kr',
               'LA1': 'la1',
               'LA2': 'la2',
               'NA1': 'na1',
               'OC1': 'oc1',
               'TR1': 'tr1',
               'RU1': 'ru'}
    return mapping[region]


def translateRegion(region):
    mapping = {'br1': 'Region.brazil',
               'eun1': 'Region.europe_north_east',
               'euw1': 'Region.europe_west',
               'jp1': 'Region.japan',
               'kr': 'Region.korea',
               'la1': 'Region.latin_america_north',
               'la2': 'Region.latin_america_south',
               'na1': 'Region.north_america',
               'oc1': 'Region.oceania',
               'tr1': 'Region.turkey',
               'ru': 'Region.russia'}
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
