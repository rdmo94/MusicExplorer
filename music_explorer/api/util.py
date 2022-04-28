import json
import os
import random


def parse_track_data() -> dict:
        genre_playlist_dict = {}
        path = os.path.join(os.getcwd(), "music_explorer", "api", "data", "genre_tracks.json")
        with open(path) as genre_playlist_file:
            genre_playlist_dict = json.load(genre_playlist_file)
            return genre_playlist_dict

def select_n_random_tracks(n_songs: int, chosen_genres: list[str]) -> dict:
        genre_tracks = parse_track_data()
        generated_playlist = {}
        for random_genre in chosen_genres:
            generated_playlist[random_genre] = random.sample(
                genre_tracks[random_genre], n_songs)
        return generated_playlist

def reverse_genre_to_track_ids_dict(genre_to_tracks:dict[str,list[str]]) -> dict[str,str]:
    """
    Reversing a dict by creating a key for every item in the list of the old values. 
    {pop:['123', '321']}
    becomes
    {'123':pop, '321':pop}
    """
    reversed_dict = {}
    for genre, tracks in genre_to_tracks.items():
        for track in tracks:
            reversed_dict[track] = genre
    
    return reversed_dict