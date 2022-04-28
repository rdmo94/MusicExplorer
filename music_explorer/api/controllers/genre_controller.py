import json
import logging
from requests import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..util import parse_track_data

logging.getLogger('requests').setLevel(logging.WARNING)

class GetAllGenresView(APIView):
    def get(self, request):
        track_data = parse_track_data()
        return Response(data=json.dumps(list(track_data.keys())),status=status.HTTP_200_OK)