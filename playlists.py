from operator import index
from numpy import NaN
import spotipy
import json
import pandas as pd
import numpy as np
from spotipy.oauth2 import SpotifyClientCredentials


SPOTIPY_CLIENT_ID = "97246a4390bf4516b9177ae13269fe86"
SPOTIPY_CLIENT_SECRET = "b0546fc6e15e4db4ab491455c724dd19"
SONG_THRESHOLD = 10


class Playlist:
    def __init__(self, id, genre):
        self.id = id
        self.genre = genre

    # def fromJson(json):


def fetchPlaylists():
    spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(
        client_id=SPOTIPY_CLIENT_ID, client_secret=SPOTIPY_CLIENT_SECRET))

    with open('playlists.json', 'w') as outfile:
        pairs = {}

        for i in range(130):
            try:
                offset = (i+1)*50
                playlists = spotify.user_playlists(
                    "thesoundsofspotify", limit=50, offset=offset)
                print(f'Fethed with offset {offset} --')
                for i in playlists["items"]:
                    pairs[i["name"]] = i["id"]
            except Exception as e:
                continue
                # playlists = spotify.user_playlists("thesoundsofspotify", limit=50,)
        json.dump(pairs, outfile, ensure_ascii=False)


def filterPlaylistsToSoundOf():
    with open('playlists.json') as json_file:
        data = json.load(json_file)

    
    with open('filteredPlaylists.json', 'w') as outfile:
        pairs = {}
        for key, value in data.items():
            if "sound of" in key.lower():
                pairs[key] = value
            elif "sounds of" in key.lower():
                pairs[key] = value
        json.dump(pairs, outfile, ensure_ascii=False)

# fetchPlaylists()
# filterPlaylistsToSoundOf()

def matrixTest():
    matrix = {}


    # matrix = np.empty([100, 100])
    # for i in range(100):
    #     for j in range(100):
    #         if i == j:
    #             matrix[i][j] = NaN
    #         else:
    #             matrix[i][j] = 0
        
    genres = {
        "pop" : ["country", "country", "country", "k-pop", "modern pop", "modern pop"],
        "country" : ["pop", "modern pop"],
        "modern pop" : ["pop", "pop", "pop", "k-pop"],
        "k-pop" : ["pop", "modern pop"],
    }


    matrix = np.zeros([len(list(genres.keys())),len(list(genres.keys()))])

    print(matrix)

    # matrix["forest psy"] = ["psycadelic trance", "dark psytrance"]
    # matrix["psycadelic trance"] = ["forest psy", "dark psytrance"]
    # matrix["dark psytrance"] = ["forest psy", "psycadelic trance" ]

    # print(matrix)

    df = pd.DataFrame(data=matrix, columns=list(genres.keys()), index=list(genres.keys()))
    # df[0][1] += 1
    print(df)

    for i in list(genres.keys()):
        current_genres = genres[i]
        for g in current_genres:
            df[i][g] += 1

    print(df)
        

matrixTest()
