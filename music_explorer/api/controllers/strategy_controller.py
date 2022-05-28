from spotify.controllers import track_controller
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from api import strategies as stg
#import spotify.controllers.track_controller as fuck_this_shit
#from music_explorer.spotify.controllers.track_controller import TrackView
#from spotify.controllers import *
#import spotify.controllers as SpotifyControllers
#from music_explorer.spotify.controllers.track_controller import TrackView


from ..util import select_n_random_tracks, reverse_genre_to_track_ids_dict


RANDOM = 0
TAKE_ME_AWAY = 1
ALCALC = 2
SMOOTH_T = 3


def get_genre_to_tracks_dict(request, genre_track_ids:dict[str,list[str]]):
    track_id_to_genre_lookup:dict[str,str] = reverse_genre_to_track_ids_dict(genre_track_ids)
    all_track_ids = []
    for _, tracks in genre_track_ids.items():
        all_track_ids.extend(tracks)
    
    sp_request = HttpRequest()
    sp_request.method = "GET"
    sp_request.session = request.session
    
    all_tracks_response = track_controller.TrackView.as_view()(sp_request, all_track_ids)
    all_tracks = []

    if all_tracks_response.status_code == 200:
        all_tracks = all_tracks_response.data
    else:
        return None
    

    genre_to_tracks = {}

    for track in all_tracks:
        track_genre = track_id_to_genre_lookup[track['id']]
        if track_genre in genre_to_tracks:
            genre_to_tracks[track_genre].append(track)
        else:
            genre_to_tracks[track_genre] = [track]
    return genre_to_tracks



class RandomStrategy(APIView):
    def post(self, request, format=None):
        id = RANDOM
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        random_genres_chosen = stg.random_choose_n_random_unfamiliar_genres(
            user_genres=user_genres, n_genres=n_genres)
        genre_tracks = select_n_random_tracks(n_songs=n_songs_per_genre, chosen_genres=random_genres_chosen)
        genre_to_tracks_dict = get_genre_to_tracks_dict(request=request, genre_track_ids=genre_tracks)
        if genre_to_tracks_dict is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(data=json.dumps({"playlist" : genre_to_tracks_dict, "genres" : random_genres_chosen, "id" : id}),
                        status=status.HTTP_200_OK)


class TakeMeAwayStrategy(APIView):
    def post(self, request, format=None):
        id = TAKE_ME_AWAY
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        genres = stg.furthest_or_closest_genres(user_genres=user_genres, n_genres=n_genres, furthest=True)
        path_tracks = select_n_random_tracks(n_songs=n_songs_per_genre, chosen_genres=genres)
        genre_to_tracks_dict = get_genre_to_tracks_dict(request=request, genre_track_ids=path_tracks)
        if genre_to_tracks_dict is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(data=json.dumps({"playlist" : genre_to_tracks_dict, "genres" : genres, "id" : id}),
                        status=status.HTTP_200_OK)


class ALittleCuriousStrategy(APIView):
    def post(self, request, format=None):
        id = ALCALC
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        user_genres = json_data["user_genres"]
        genres = stg.furthest_or_closest_genres(user_genres=user_genres, n_genres=n_genres, furthest=False)
        path_tracks = select_n_random_tracks(n_songs=n_songs_per_genre, chosen_genres=genres)
        genre_to_tracks_dict = get_genre_to_tracks_dict(request=request, genre_track_ids=path_tracks)
        if genre_to_tracks_dict is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(data=json.dumps({"playlist" : genre_to_tracks_dict, "genres" : genres, "id" : id}),
                        status=status.HTTP_200_OK)


class SmoothTransitionRandomStrategy(APIView):
    def post(self, request, format=None):
        id = SMOOTH_T
        json_data = request.data
        n_genres = json_data["n_genres"]
        n_songs_per_genre = json_data["n_songs_genre"]
        source_genre = json_data["source_genre"]
        target_genre = json_data["target_genre"]
        path_genres = stg.smooth_transition_find_path_from_familiar_to_unfamiliar_genre(source_genre=source_genre, target_genre=target_genre, n_genres=n_genres)
        path_tracks = select_n_random_tracks(n_songs=n_songs_per_genre, chosen_genres=path_genres)
        genre_to_tracks_dict = get_genre_to_tracks_dict(request=request, genre_track_ids=path_tracks)
        if genre_to_tracks_dict is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(data=json.dumps({"playlist" : genre_to_tracks_dict, "genres" : path_genres, "id" : id}),
                        status=status.HTTP_200_OK)