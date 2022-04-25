import json
import re
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from api import strategies as stg

class RandomStrategy(APIView):
    def post(self, request, format=None):
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        random_genres_chosen = stg.random_choose_n_random_unfamiliar_genres(user_genres=user_genres, n_genres=n_genres)

        return requests.post("/spotify/generate_playlist", json=json.dumps(
            {"n_songs_genre": n_songs_per_genre, "playlist_genres" : random_genres_chosen}
        ))