from django_cassiopeia import cassiopeia as cass
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, permissions
from datapipelines.common import NotFoundError
import time


class Summoner(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, name):

        possible_accounts = []

        for region in cass.data.Region:
            try:
                summoner = cass.Summoner(name=name, region=region)
                icon = cass.core.staticdata.profileicon.ProfileIcon(id=summoner.profile_icon.id)
                possible_accounts.append({
                    "name": name,
                    "puuid": summoner.puuid,
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
