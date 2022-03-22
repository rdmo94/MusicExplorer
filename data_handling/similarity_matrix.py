from asyncore import read
from importlib import import_module
from operator import index, indexOf
from typing import Tuple
from numpy import NaN
import sys
import os
SCRIPT_DIR = os.path.dirname(os.path.abspath("spotify_scraper.py"))
sys.path.append(os.path.dirname(SCRIPT_DIR))
import json
import pandas as pd
import numpy as np
import itertools
from spotipy.oauth2 import SpotifyClientCredentials
from spotify_scraper import parse_genre_genres, scrape_genres_to_json_files, scrape_artist_genres_to_json_files, read_json_file
# import spotify.spotify_scraper

def get_genre_to_index() -> dict:
    return read_json_file("../data/genre_to_index.json")


def get_index_to_genre() -> dict:
    return read_json_file("../data/index_to_genre.json")

def generate_similarity_matrix():
    artist_genres = [{"artistID" : ["rock", "pop"]}, {"artistID" : ["rock", "pop"]}]
    genre_to_index = get_genre_to_index()
    matrix = np.zeros([len(list(genre_to_index.keys())),len(list(genre_to_index.keys()))])

    for artist in artist_genres:
        for artist_id, genres in artist:
            genre_pairs = get_unique_pairs_in_list(genres)
            for pair in genre_pairs:
                matrix[genre_to_index[pair[0]], genre_to_index[pair[1]]] += 1

    dataframe = pd.DataFrame(data=matrix, columns=list(genre_to_index.keys()), index=list(genre_to_index.keys()))
    dataframe.to_json("./matrix_test.json")

def get_unique_pairs_in_list(elements: list[str]) -> list[tuple[str, str]]:
    return list(itertools.combinations(elements, 2))

def generate_matrix_old():
    genre_genres_dict = parse_genre_genres()

    # generating the right size 2d array filled with 0's
    matrix = np.zeros([len(list(genre_genres_dict.keys())),
                      len(list(genre_genres_dict.keys()))])

    genre_labels = list(map(str.lower, list(genre_genres_dict.keys())))
    genreToIndex = get_genre_to_index()

    for i in list(genre_genres_dict.keys()):
        current_genres = genre_genres_dict[i]

        for g in current_genres:
            try:
                matrix[genreToIndex[i.lower()]][genreToIndex[g]] += 1
                matrix[genreToIndex[g]][genreToIndex[i.lower()]] += 1
            except Exception as e:
                None

    dataframe = pd.DataFrame(data=matrix, columns=list(genre_labels.keys()), index=list(genre_labels.keys()))
    dataframe.to_json("./matrix.json")

def get_matrix() -> pd.DataFrame:
    genres = parse_genre_genres()
    matrix_dict = read_json_file("./matrix.json")
    df = pd.DataFrame.from_dict(matrix_dict, orient="index")
    return df

generate_similarity_matrix()