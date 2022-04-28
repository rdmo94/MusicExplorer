import json
import os
import random
from django.http import HttpRequest
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from api import strategies as stg
from spotify.controllers import track_controller
from ..util import select_n_random_tracks

RANDOM = 0
TAKE_ME_AWAY = 1
ALCALC = 2
SMOOTH_T = 3



class RandomStrategy(APIView):
    def post(self, request, format=None):
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        random_genres_chosen = stg.random_choose_n_random_unfamiliar_genres(
            user_genres=user_genres, n_genres=n_genres)
        genre_tracks = select_n_random_tracks(n_songs=n_songs_per_genre, chosen_genres=random_genres_chosen)
        playlist = []
        genres = []
        id = RANDOM
        for genre, tracks in genre_tracks.items():
            genres.append(genre)
            for track in tracks:
                sp_request = HttpRequest()
                sp_request.method = "GET"
                sp_request.session = request.session
                # track_reponse = requests.get(f"http://127.0.0.1:8000/spotify/track/{track}")
                track_reponse = track_controller.TrackView.as_view()(sp_request, track)
                if track_reponse.status_code != 200:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    playlist.append({genre: track_reponse.data})
        return Response(data=json.dumps({"playlist" : playlist, "genres" : genres, "id" : id}),
                        status=status.HTTP_200_OK)


class TakeMeAwayStrategy(APIView):
    def post(self, request, format=None):
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        furthest_genres_chosen = stg.take_me_away_find_furthest_genres_from_genre(
            user_genres=user_genres, n_genres=n_genres)

        return requests.post("/spotify/generate_playlist", json=json.dumps(
            {"n_songs_genre": n_songs_per_genre,
                "playlist_genres": furthest_genres_chosen}
        ))


class ALittleCuriousStrategy(APIView):
    def post(self, request, format=None):
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        random_genres_chosen = stg.random_choose_n_random_unfamiliar_genres(
            user_genres=user_genres, n_genres=n_genres)

        return requests.post("/spotify/generate_playlist", json=json.dumps(
            {"n_songs_genre": n_songs_per_genre,
                "playlist_genres": random_genres_chosen}
        ))


class SmoothTransitionRandomStrategy(APIView):
    def post(self, request, format=None):
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        source_genre = json_data["source_genre"]
        target_genre = json_data["target_genre"]
        path_genres = stg.smooth_transition_find_path_from_familiar_to_unfamiliar_genre(source_genre=source_genre, target_genre=target_genre)
        path_tracks = select_n_random_tracks(n_songs=n_songs_per_genre, chosen_genres=path_genres)
        playlist = []
        genres = []
        id = RANDOM
        for genre, tracks in path_tracks.items():
            genres.append(genre)
            for track in tracks:
                sp_request = HttpRequest()
                sp_request.method = "GET"
                sp_request.session = request.session
                # track_reponse = requests.get(f"http://127.0.0.1:8000/spotify/track/{track}")
                track_reponse = track_controller.TrackView.as_view()(sp_request, track)
                if track_reponse.status_code != 200:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    playlist.append({genre: track_reponse.data})
        return Response(data=json.dumps({"playlist" : playlist, "genres" : genres, "id" : id}),
                        status=status.HTTP_200_OK)