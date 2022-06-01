### This file contains code from the beginning used for fetching data from Spotify

from asyncore import read
import logging
from operator import index, indexOf
from numpy import NaN
import spotipy
import json
import pandas as pd
import numpy as np
from spotipy.oauth2 import SpotifyClientCredentials
from spotify_scraper import parse_genre_genres, scrape_genres_to_json_files, scrape_artist_genres_to_json_files, read_json_file

logging.getLogger('spotipy').setLevel(logging.WARNING)

SPOTIPY_CLIENT_ID = "97246a4390bf4516b9177ae13269fe86"
SPOTIPY_CLIENT_SECRET = "b0546fc6e15e4db4ab491455c724dd19"
SONG_THRESHOLD = 10


class Playlist:
    def __init__(self, id, genre):
        self.id = id
        self.genre = genre

def fetchPlaylists():
    spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
        client_id=SPOTIPY_CLIENT_ID, client_secret=SPOTIPY_CLIENT_SECRET))

    with open('playlists50first.json', 'w') as outfile:
        pairs = {}

        for i in range(1):
            try:
                offset = (i)*50
                playlists = spotify.user_playlists(
                    "thesoundsofspotify", limit=50, offset=offset)
                print(f'Fethed with offset {offset} --')
                for i in playlists["items"]:
                    pairs[i["name"]] = i["id"]
            except Exception as e:
                continue
        json.dump(pairs, outfile, ensure_ascii=False)


def filter_playlists_to_sound_of():
    with open('playlists50first.json') as json_file:
        data = json.load(json_file)

    with open('filteredPlaylists50first.json', 'w') as outfile:
        pairs = {}
        for key, value in data.items():
            if "sound of" in key.lower():
                pairs[key] = value
            elif "sounds of" in key.lower():
                pairs[key] = value
        json.dump(pairs, outfile, ensure_ascii=False)

def generate_matrix_and_save_to_file():
    genre_genres_dict = parse_genre_genres()

    #generating the right size 2d array filled with 0's
    matrix = np.zeros([len(list(genre_genres_dict.keys())), len(list(genre_genres_dict.keys()))])
  
    genre_labels = list(map(str.lower, list(genre_genres_dict.keys())))
    genreToIndex = {}

    for index in range(len(genre_labels)):
        genreToIndex[genre_labels[index]] = index

    indexes = [*range(0, len(genre_labels), 1)]  

    try:
        for i in list(genre_genres_dict.keys()):
            current_genres = genre_genres_dict[i]
            
            for g in current_genres:
                try:               
                    matrix[genreToIndex[i.lower()]][genreToIndex[g]] = matrix[genreToIndex[i.lower()]][genreToIndex[g]] + 1
                    matrix[genreToIndex[g]][genreToIndex[i.lower()]] = matrix[genreToIndex[g]][genreToIndex[i.lower()]] +1
                except Exception as e:
                    print(i)
                    print(g)
                    print(e)

    except Exception as e:
        print(e)

    df = pd.DataFrame(data=matrix, columns=indexes, index=indexes)
    df.to_json("./matrix.json")

def parse_matrix() -> pd.DataFrame:
    genres = parse_genre_genres()
    genre_labels = list(map(str.lower, list(genres.keys())))
    genreToIndex = {}
    indexToGenre = {}

    for index in range(len(genre_labels)):
        genreToIndex[genre_labels[index]] = index
        indexToGenre[index] = genre_labels[index]
    with open('index_to_genre.json', 'w') as outfile:
        json.dump(indexToGenre, outfile, ensure_ascii=False)

    matrix_dict = read_json_file("./matrix.json")
    genre_to_index = read_json_file("./genre_to_index.json")
    matrix_dataframe = pd.DataFrame.from_dict(matrix_dict, orient="index")
    return matrix_dataframe
