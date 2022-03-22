from asyncore import read
from operator import index, indexOf
from numpy import NaN
import spotipy
import json
import pandas as pd
import numpy as np
from spotipy.oauth2 import SpotifyClientCredentials
from data_handling.spotify.spotify_scraper import parse_genre_genres, scrape_genres_to_json_files, scrape_artist_genres_to_json_files, read_json_file


def get_genre_to_index() -> dict:
    return read_json_file("../data/genre_to_index.json")


def get_index_to_genre() -> dict:
    return read_json_file("../data/index_to_genre.json")


def generate_matrix():
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
