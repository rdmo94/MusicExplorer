from http import HTTPStatus
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

class RandomStrategy(APIView):
    def parse_track_data(self) -> dict:
        genre_playlist_dict = {}
        path = os.path.join(os.getcwd(), "music_explorer", "api", "data", "genre_tracks.json")
        with open(path) as genre_playlist_file:
            genre_playlist_dict = json.load(genre_playlist_file)
            return genre_playlist_dict

    def select_n_random_tracks(self, n_songs: int, chosen_genres: list[str]) -> dict:
        genre_tracks = self.parse_track_data()
        generated_playlist = {}
        for random_genre in chosen_genres:
            generated_playlist[random_genre] = random.sample(
                genre_tracks[random_genre], n_songs)
        return generated_playlist

    def post(self, request, format=None):
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        random_genres_chosen = stg.random_choose_n_random_unfamiliar_genres(
            user_genres=user_genres, n_genres=n_genres)
        genre_tracks = self.select_n_random_tracks(n_songs=n_songs_per_genre, chosen_genres=random_genres_chosen)
        playlist = []
        for genre, tracks in genre_tracks.items():
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
        return Response(data=json.dumps(playlist),
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
        random_genres_chosen = stg.random_choose_n_random_unfamiliar_genres(
            user_genres=user_genres, n_genres=n_genres)

        return requests.post("/spotify/generate_playlist", json=json.dumps(
            {"n_songs_genre": n_songs_per_genre,
                "playlist_genres": random_genres_chosen}
        ))
