from django.shortcuts import render, redirect
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from api.models import User
from ..util import get_user_tokens, get_current_user
from requests import post, put, get
from spotipy import Spotify

class GetUserPlaylists(APIView):
    def get(self, request, format=None):
        user_tokens = get_user_tokens(session_id=request.session.session_key)
        if user_tokens is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        user_id = int(get_current_user(user_tokens.access_token).get('id'))
        sp = Spotify(auth=user_tokens.access_token)
        response = sp.user_playlists(user=user_id)
        
        return Response({'data': response}, status=status.HTTP_200_OK)