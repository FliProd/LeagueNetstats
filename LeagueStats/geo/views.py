from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from geopy import Nominatim

class discreteLocation(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()


    def post(self, request, format='json'):
        geolocator = Nominatim(user_agent="LeagueOfLegendRegionBot")

        if request.data['location']:
            coords = (request.data['location']['latitude'],request.data['location']['longitude'])
            location = geolocator.reverse(coords, exactly_one=True)
            address = location.raw['address']
            zipcode = address.get('postcode', '')
            city = address.get('city', '')
            state = address.get('state', '')
            country = address.get('country', '')

            return Response({'zipcode': zipcode, 'city': city, 'state': state, 'country': country})

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
