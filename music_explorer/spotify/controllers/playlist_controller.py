import json
from posixpath import split
from random import randint
from unicodedata import name
from xmlrpc.client import MAXINT
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from api.models import User
from ..util import get_user_tokens, get_current_user, filter_spotify_playlists, genre_formatter
from requests import post, put, get
from spotipy import Spotify

class GetCurrentUserPlaylistsView(APIView):
    def get(self, request, format=None):
        current_user_response = get_current_user(
            session_id=request.session.session_key)
        user_tokens = get_user_tokens(session_id=request.session.session_key)
        if current_user_response.ok:
            user_id = int(current_user_response.json().get("id"))
            sp = Spotify(auth=user_tokens.access_token)
            user_playlists = sp.current_user_playlists()
            filtered_playlists = filter_spotify_playlists(user_playlists)
            return Response(data=json.dumps(filtered_playlists), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class CreatePlaylistView(APIView):
    def post(self, request, format=None):
        current_user_response = get_current_user(
            session_id=request.session.session_key)
        user_tokens = get_user_tokens(session_id=request.session.session_key)
        if current_user_response.ok:
            user_id = int(current_user_response.json().get("id"))
            sp = Spotify(auth=user_tokens.access_token)
            new_playlist = sp.user_playlist_create(
                user=user_id, name="MusicExplorer" + str(randint(0, MAXINT)))
            tracks_to_add = []
            for track in request.data["playlistTracks"]:
                tracks_to_add.append(track["uri"])
            add_response = sp.playlist_add_items(
                playlist_id=new_playlist["id"], items=tracks_to_add)
            if add_response is not None:
                return Response(json.dumps(new_playlist), status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class GetPlaylistGenresView(APIView):
    def split_list(self, list: list[object], max_list_size: int) -> list[object]:
        return [list[i:i + max_list_size] for i in range(0, len(list), max_list_size)]

    def get_all_playlist_tracks(self, spotify: Spotify, playlist_id: str) -> list[str]:
        playlist = spotify.playlist(playlist_id=playlist_id)
        number_of_tracks = playlist['tracks']['total']
        tracks = []
        for n in range(0, number_of_tracks, 100):
            track_chunk = spotify.playlist_tracks(
                playlist_id=playlist_id, offset=n)
            tracks.extend(track_chunk['items'])
        return tracks

    def get_track_artists(self, tracks) -> list[str]:
        artists_ids = []
        for t in tracks:
            track_artists = t['track']['artists']
            for a in track_artists:
                if (a['id']):
                    artists_ids.append(a['id'])

        return artists_ids

    def get_artist_genres(self, spotify: Spotify, artists: list[str]) -> list[str]:
        genres = []
        artist_ids_chunks = self.split_list(
            artists, 50)  # chunks of max 50 artist_ids
        for ids_chunk in artist_ids_chunks:
            artist_chunk = spotify.artists(artists=ids_chunk)
            for artist in artist_chunk['artists']:
                if artist['genres']:
                    genres.extend(artist['genres'])

        # replaces ë with e
        genres = [genre_formatter(item) for item in genres]

        return genres

    def get_occurence_dict(self, list: list[str]) -> dict[str, int]:
        occurence_dict = dict()
        for i in list:
            if i in occurence_dict:
                occurence_dict[i] = occurence_dict[i]+1
            else:
                occurence_dict[i] = 1

        return occurence_dict

    def combine_occurence_dicts(self, oc_dict1: dict[str, int], oc_dict2: dict[str, int]) -> dict[str, int]:
        for genre, dict2_occurences in oc_dict2.items():
            if genre in oc_dict1:
                oc_dict1[genre] = oc_dict1[genre]+dict2_occurences
            else:
                oc_dict1[genre] = dict2_occurences

        return oc_dict1

    def post(self, request):
        current_user_response = get_current_user(
            session_id=request.session.session_key)
        user_tokens = get_user_tokens(session_id=request.session.session_key)
        if current_user_response.ok:
            user_id = int(current_user_response.json().get("id"))
            sp = Spotify(auth=user_tokens.access_token)
            genre_ocurrences = dict()

            # 0) For each playlist: //TODO check if empty
            for playlist_id in request.data:
                tracks = get_all_playlist_tracks(sp, playlist_id)
                artists = self.get_track_artists(tracks)
                genres = self.get_artist_genres(spotify=sp, artists=artists)
                current_playlist_ocurrence_dict = self.get_occurence_dict(
                    genres)
                genre_ocurrences = self.combine_occurence_dicts(
                    genre_ocurrences, current_playlist_ocurrence_dict)

            if len(genre_ocurrences.items()) > 0:
                return Response(json.dumps(genre_ocurrences), status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_304_NOT_MODIFIED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

            
class GeneratePlaylistView(APIView):
    def post(self, request):
        json_data = request.data
        playlist_genres = json_data["playlist_genres"]
        n_songs_genre = json_data["n_songs_genre"]
        
### GLOBAL PLAYLIST HELPER FUNCTIONS

def get_all_playlist_tracks(spotify:Spotify, playlist_id:str) -> list[str]:
        playlist = spotify.playlist(playlist_id=playlist_id)
        number_of_tracks = playlist['tracks']['total']
        tracks = []
        for n in range(0, number_of_tracks, 100):
            track_chunk = spotify.playlist_tracks(playlist_id=playlist_id, offset=n)
            tracks.extend(track_chunk['items'])
        return tracks


# class UpdatePlaylistView(APIView):
#     def put(self, request, format=None):
#         current_user_response = get_current_user(session_id=request.session.session_key)
#         user_tokens = get_user_tokens(session_id=request.session.session_key)
#         if current_user_response.ok:
#             user_id = int(current_user_response.json().get("id"))
#             sp = Spotify(auth=user_tokens.access_token)
#             update_response = sp.user_playlist_change_details(user=user_id, playlist_id=request.data["name"])
#             if update_response is not None:
#                 return Response(status=status.HTTP_200_OK)
#             return Response(status=status.HTTP_304_NOT_MODIFIED)
#         else:
#             return Response(status=status.HTTP_401_UNAUTHORIZED)
