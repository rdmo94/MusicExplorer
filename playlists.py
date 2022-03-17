import spotipy
import json
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
filterPlaylistsToSoundOf()
