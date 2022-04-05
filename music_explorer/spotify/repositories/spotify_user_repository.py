from django.shortcuts import render, redirect
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from api.models import User
from ..util import get_user_tokens, get_current_user
from requests import post, put, get
from spotipy import Spotify

class GetCurrentSpotifyUser(APIView):
    def get(self, request, format=None):
        current_user_response = get_current_user(session_id=request.session.session_key)
        if current_user_response.ok:
            return Response({'data': current_user_response.json()}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
       
        