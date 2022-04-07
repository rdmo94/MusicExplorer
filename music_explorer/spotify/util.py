from email import header
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
from rest_framework import status
from rest_framework.response import Response


BASE_URL = "https://api.spotify.com/v1/me/"


def clear_user_token(session_id):
    spotify_token = SpotifyToken.objects.get(user=session_id)
    spotify_token.delete()


def get_current_user(session_id):
    user_tokens = get_user_tokens(session_id)
    if user_tokens:
        response = get(BASE_URL, headers={
                       "Authorization": 'Bearer ' + user_tokens.access_token, "Accept": "application/json"})
        return response
    else:
        Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    print(user_tokens)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def create_user(session_id):
    response = get_current_user(session_id=session_id)
    if response.ok:
        current_spotify_user = response.json()
        response2 = post("http://127.0.0.1:8000/api/create_user",
                         json={"id": current_spotify_user.get('id'), "name": current_spotify_user.get('display_name')}, headers={"Content-Type": "application/json"})
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True

    return False

def filter_spotify_playlists(playlists: dict):
    filtered_playlists = []
    for item in playlists["items"]:
        filtered_playlists.append({item["id"] : item["name"]})
    return filtered_playlists


def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token)
