from django_cassiopeia import cassiopeia as cass
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import permissions


class Summoner(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        for region in cass.data.Region:
            try:
                summoner = cass.Summoner(name="FliProd", region=cass.data.Region(region))
                print(summoner.id)
                print(summoner.account_id)
                print(summoner.puuid)

            except Exception:
                print("not in: " + region.__str__())

        return JsonResponse({'hi': 'no'})
