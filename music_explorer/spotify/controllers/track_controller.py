import json
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from api.models import User
from ..util import filter_spotify_tracks, get_user_tokens, get_current_user, filter_spotify_playlists
from requests import post, put, get
from spotipy import Spotify

class TrackView(GenericAPIView):
    def get(self, request, playlistId=None, format=None):
        if playlistId is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        current_user_response = get_current_user(session_id=request.session.session_key)
        user_tokens = get_user_tokens(session_id=request.session.session_key)

        if current_user_response.ok:
            sp = Spotify(auth=user_tokens.access_token)

            # Limit for number of tracks = 100
            playlist_tracks = sp.playlist_tracks(playlist_id=playlistId)
            filtered_playlists = filter_spotify_tracks(playlist_tracks)
            return Response(data=json.dumps(filtered_playlists), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        