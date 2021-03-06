from email import header

from pandas import array
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
from rest_framework import status
from rest_framework.response import Response
import functools


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


def filter_spotify_playlist_tracks(tracks):
    filtered_tracks = []
    for track in tracks:
        filtered_track_artists = []
        for artist in track["artists"]:
            filtered_track_artists.append({"id": artist["id"]})
        filtered_tracks.append({"name": track["name"], "id": track["id"],
                               "duration": track["duration_ms"], "artists": filtered_track_artists, "image" : track["album"]["images"][0]["url"]})
    return filtered_tracks


def filter_spotify_track(track):
    filtered_track = {}
    filtered_track["name"] = track["name"]
    filtered_track["image"] = track["album"]["images"][0]["url"]
    filtered_track["id"] = track["id"]
    filtered_track["duration"] = track["duration_ms"]
    filtered_track["artists"] = list(map(lambda tr: tr["name"], track["artists"]))

    return filtered_track


def filter_spotify_playlists(playlists: dict):
    filtered_playlists = []
    for item in playlists["items"]:
        filtered_playlists.append({item["id"]: item["name"]})
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

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token)


def genre_formatter(genre: str) -> str:
    """
    Translates to ascii, lowercase and replaces symbols
    """
    
    import unidecode
    genre = genre.lower()
    genre = unidecode.unidecode(genre)
    genre = genre.replace(" ", "qqqspcqqq")
    genre = genre.replace("-", "qqqhphnqqq")
    genre = genre.replace("'", "qqqpstrphqqq")
    genre = genre.replace("&", "qqqndqqq")
    genre = genre.replace(":", "qqqclnqqq")
    genre = genre.replace("+", "qqqplsqqq")
    genre = genre.replace("1", "qqqenoqqq")
    genre = genre.replace("2", "qqqowtqqq")
    genre = genre.replace("3", "qqqeerhtqqq")
    genre = genre.replace("4", "qqqruofqqq")
    genre = genre.replace("5", "qqqevifqqq")
    genre = genre.replace("6", "qqqxisqqq")
    genre = genre.replace("7", "qqqnevesqqq")
    genre = genre.replace("8", "qqqthgieqqq")
    genre = genre.replace("9", "qqqeninqqq")
    genre = genre.replace("0", "qqqorezqqq")
    return genre


def genre_prettyfier(genre: str) -> str:
    genre = genre.replace("qqqspcqqq", " ")
    genre = genre.replace("qqqhphnqqq", "-")
    genre = genre.replace("qqqpstrphqqq", "'")
    genre = genre.replace("qqqndqqq", "&")
    genre = genre.replace("qqqclnqqq", ":")
    genre = genre.replace("qqqplsqqq", "+")
    genre = genre.replace("qqqenoqqq", "1")
    genre = genre.replace("qqqowtqqq", "2")
    genre = genre.replace("qqqeerhtqqq", "3")
    genre = genre.replace("qqqruofqqq", "4")
    genre = genre.replace("qqqevifqqq", "5")
    genre = genre.replace("qqqxisqqq", "6")
    genre = genre.replace("qqqnevesqqq", "7")
    genre = genre.replace("qqqthgieqqq", "8")
    genre = genre.replace("qqqeninqqq", "9")
    genre = genre.replace("qqqorezqqq", "0")
    genre = genre.title()
    return genre


def split_list(list:list[str], max_list_size) -> list[list]:
    """
    Splitting list into max_list_size chunks. Useful for splitting list of id's into chunks before making requests to spotify.
    """
    return [list[i:i + max_list_size] for i in range(0, len(list), max_list_size)]