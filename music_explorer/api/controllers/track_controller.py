import json
import logging
import random
from typing import List
from django.http import HttpRequest
from requests import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..util import parse_track_data
from spotify.controllers import track_controller as sp_track_controller


logging.getLogger('requests').setLevel(logging.WARNING)

class RenewSongView(APIView):
    def post(self, request):
        track_data = parse_track_data()
        trackToReplace = request.data
        tracks_for_genre: List = track_data[trackToReplace["track"]["genre"]]
        tracks_for_genre.remove(trackToReplace["track"]["id"])
        newTrackId = random.sample(tracks_for_genre, 1)
        sp_request = HttpRequest()
        sp_request.method = "GET"
        sp_request.session = request.session
        
        get_track_response = sp_track_controller.TrackView.as_view()(sp_request, newTrackId)

        if get_track_response.status_code == 200:
            newTrack = get_track_response.data
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(data=newTrack,status=status.HTTP_200_OK)

