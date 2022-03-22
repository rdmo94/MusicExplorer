import json
import os
import spotipy
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
import logging
import sys
#logging.basicConfig(filename='logfile.log', encoding='utf-8', level=logging.DEBUG)
#logging.getLogger().addHandler(logging.StreamHandler())

app1 = ["97246a4390bf4516b9177ae13269fe86","b0546fc6e15e4db4ab491455c724dd19"]
app2 = ["70ab3a9f4a844dda8202f7946bd2dba2", "145ff4ea82f648bab973af480e4371b2"]
app3 = ["0e8f0b0bd124410492a05cb32e00db06", "f2c636adb70449c2a985f04a15026774"]


proxy = 'http://lum-customer-c_c304ebd4-zone-static-route_err-block-country-dk-dns-remote:takeoff!@zproxy.lum-superproxy.io:22225'

proxies = {
    'http': 'http://lum-customer-c_c304ebd4-zone-static-route_err-block-country-dk-dns-remote:takeoff!@zproxy.lum-superproxy.io:22225',
    'https': 'http://lum-customer-c_c304ebd4-zone-static-route_err-block-country-dk-dns-remote:takeoff!@zproxy.lum-superproxy.io:22225'
}

os.environ['http_proxy'] = proxy 
os.environ['HTTP_PROXY'] = proxy
os.environ['https_proxy'] = proxy
os.environ['HTTPS_PROXY'] = proxy

spotify:Spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=app2[0], client_secret=app2[1]))
scraped_genres = []


def main():
    genre_genres_dict = parse_genre_genres()
    print("brother")

#RDMO use this one
def parse_genre_genres() -> dict[str,list[str]]: 
    genre_genres_dict = {}

    # get all files
    files = os.listdir("genre_genres/")
    for f in files:
        # Opening JSON file
        file = open("genre_genres/" + f)
        data = json.load(file)
        for genre, genres in data.items():
            genre = convert_string_to_unicode(genre)
            genres = list(map(convert_string_to_unicode, genres)) # remove shit characters from genres
            while genre.lower() in genres: 
                genres.remove(genre.lower())
            genre_genres_dict[genre] = genres
        file.close()
    
    return genre_genres_dict

def convert_string_to_unicode(fucked_string:str) -> str:
    import unidecode
    unfucked_string = unidecode.unidecode(fucked_string)
    unfucked_string = unfucked_string.replace("'","")
    return unfucked_string


def split_list(list:list[str], max_list_size) -> list[list]:
    return [list[i:i + max_list_size] for i in range(0, len(list), max_list_size)] 

def scrape_artist_genres_to_json_files() -> None:
    #get already scraped genres from folder
    scraped_genres = get_genres_from_folder("genre_genres")

    # get all files
    files = os.listdir("genre_artists/")

    #read all genres and artists
    counter = len(scraped_genres)
    for f in files:
        genre_genres = []
        genre = f.replace(".json","")
        genre_artists_dict = read_json_file(os.path.join("genre_artists", f))
        if genre not in scraped_genres:
            try:
                artist_ids = list(genre_artists_dict.values())[0]
                artist_ids_lists = split_list(list=artist_ids, max_list_size=50)

                for artist_id_list in artist_ids_lists:
                    artist_genres = get_multiple_artists_genres(artist_ids=artist_id_list)
                    genre_genres.extend(artist_genres)
                
                file_name = os.path.join("genre_genres", genre)
                write_dict_to_file(file_name, {genre:genre_genres})
                print(genre + " genres scraped! " + str(counter)+"/"+str(len(files)))
                counter = counter+1
            except Exception as e:
                print(str(e))
        else:
            print(genre + " genres ALREADY scraped")

def scrape_genres_to_json_files():
    #get already scraped genres from folder
    scraped_genres = get_genres_from_folder("genre_artists")

    #read all genres + playlist id
    genres_playlistIds:dict = read_json_file("genres_playlist.json")

    #create file for each genre
    for genre, playlist_id in genres_playlistIds.items():
        if genre not in scraped_genres:
            artists = get_playlist_artists(playlist_id=playlist_id)
            create_genre_artists_file(genre=genre, artists=artists)
        else:
            print(genre + " aldready scraped :)")

def get_genres_from_folder(folder_path:str) -> list[str]:
    genres = [] 
    files = os.listdir(folder_path)
    for f in files:
        genres.append(f.replace(".json",""))
    
    return genres

def read_json_file(path:str) -> dict:
     with open(path) as json_dict:
        return json.load(json_dict)

def create_genre_artists_file(genre:str, artists:list[str]) -> None:
    file_path = os.path.join("genre_artists", genre)
    write_dict_to_file(file_path, {genre:artists})

def write_dict_to_file(filename:str, data:dict) -> None:
    with open(filename + '.json', 'w') as outfile:
        json.dump(data, outfile, ensure_ascii=False)

def get_playlist_artists(playlist_id) -> list[str]:
    artist_ids = []

    #get top x songs
    tracks = spotify.playlist_tracks(playlist_id=playlist_id)
    for track in tracks['items']:
        try:
            artists = track['track']['artists']
            for a in artists:
                artist_id = a['id']
                artist_ids.append(artist_id)
        except Exception as e:
            print(str(e))

    return list(set(artist_ids)) #removes duplicates


def get_artist_genres(artist_id:str) -> list[str]:
    artist = spotify.artist(artist_id=artist_id)
    artist_genres = artist['genres']
    return artist_genres

def get_multiple_artists_genres(artist_ids:list[str]) -> list[str]:
    genres = []
    artists = spotify.artists(artists=artist_ids)
    for artist in artists['artists']:
        if artist['genres']:
            genres.extend(artist['genres'])
    return genres
    


main()