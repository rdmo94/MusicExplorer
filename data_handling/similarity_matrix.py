from importlib.resources import read_text
import os
import random
from numpy import NaN, mat
import pandas as pd
import numpy as np
import itertools
from spotipy.oauth2 import SpotifyClientCredentials
from spotify_scraper import parse_genre_genres, scrape_genres_to_json_files, scrape_artist_genres_to_json_files, read_json_file, convert_string_to_unicode
# import spotify.spotify_scraper

def get_genre_to_index() -> dict:
    return read_json_file(os.path.join("data_handling", "data","genre_to_index.json"))


def get_index_to_genre() -> dict:
    return read_json_file(os.path.join("data_handling", "data","index_to_genre.json"))

def generate_similarity_matrix():
    artist_genres = read_json_file(os.path.join("data_handling", "data","artists_genres.json"))
    genre_to_index = get_genre_to_index()
    matrix = np.zeros([len(list(genre_to_index.keys())),len(list(genre_to_index.keys()))])

    for artist, genres in artist_genres.items():
        
            genre_pairs = get_unique_pairs_in_list(genres)
            for pair in genre_pairs:
                try:
                    matrix[genre_to_index[convert_string_to_unicode(pair[0])], genre_to_index[convert_string_to_unicode(pair[1])]] += 1
                    matrix[genre_to_index[convert_string_to_unicode(pair[1])], genre_to_index[convert_string_to_unicode(pair[0])]] += 1
                except Exception as e:
                    continue

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
    # genres = parse_genre_genres()
    matrix_dict = read_json_file("./data/matrix.json")
    df = pd.DataFrame.from_dict(matrix_dict, orient="index")
    return df

# matrix = get_matrix()
# np_matrix = matrix.to_numpy()
# with open("test.bin", "w") as outfile:
#     np_matrix.tofile(outfile)

# import struct
# file = open("test.bin", "rb")

# byte = file.read(16)
# while byte:
#     cooccur_data = struct.unpack('iid', byte)
#     print(cooccur_data)
#     byte = file.read(16)

# file.close()

# matrix_dict = read_json_file("data/matrix.json")
# with open("matrix_txt.txt", "w") as outfile:
#     for key, value in matrix_dict.items():
#         for keyInner, co_count in value.items():
#                 if(co_count > 0):
#                     outfile.write(f"({key}, {keyInner}, {co_count})\n")
# outfile.close()

# matrix_file = open("matrix_txt.txt", "r")
# matrix_content = matrix_file.read()
# lst = matrix_content.split("\n")
# random.shuffle(lst)

f = open("matrix_txt.txt", 'r')
mytext = f.read()

with open("matrix.bin", "wb") as outfile:
    outfile.write(bytearray(mytext, 'utf-8'))
outfile.close()
