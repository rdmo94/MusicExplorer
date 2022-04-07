import json
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from api.models import User
from ..util import get_user_tokens, get_current_user, filter_spotify_playlists
from requests import post, put, get
from spotipy import Spotify

class GetCurrentUserPlaylistsView(APIView):
    def get(self, request, format=None):
        current_user_response = get_current_user(session_id=request.session.session_key)
        user_tokens = get_user_tokens(session_id=request.session.session_key)
        if current_user_response.ok:
            user_id = int(current_user_response.json().get("id"))
            sp = Spotify(auth=user_tokens.access_token)
            user_playlists = sp.current_user_playlists()
            filtered_playlists = filter_spotify_playlists(user_playlists)
            return Response(data=json.dumps(filtered_playlists), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        