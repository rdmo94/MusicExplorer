import json
from operator import contains
import os
import spotipy
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
import logging
from os.path import exists
import sys
import sqlite3
logging.basicConfig(filename='logfile.log', encoding='utf-8', level=logging.DEBUG)
logging.getLogger().addHandler(logging.StreamHandler())

logging.getLogger('spotipy').setLevel(logging.WARNING)

app1 = ["97246a4390bf4516b9177ae13269fe86", "b0546fc6e15e4db4ab491455c724dd19"]
app2 = ["70ab3a9f4a844dda8202f7946bd2dba2", "145ff4ea82f648bab973af480e4371b2"]
app3 = ["0e8f0b0bd124410492a05cb32e00db06", "f2c636adb70449c2a985f04a15026774"]
app4 = ["49c8efc8a3904b44b9f78c8670bab933", "3eb720535fda431eac3371897dfd7915"]

os.environ['SPOTIPY_CLIENT_ID'] = "97246a4390bf4516b9177ae13269fe86"
os.environ['SPOTIPY_CLIENT_SECRET'] = "b0546fc6e15e4db4ab491455c724dd19"
#export SPOTIPY_CLIENT_ID='your-spotify-client-id'
#export SPOTIPY_CLIENT_SECRET='your-spotify-client-secret'
#client_id=app4[0], client_secret=app4[1]

spotify:Spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials() 
    #proxies={
   #'http': 'http://lum-customer-c_c304ebd4-zone-static-route_err-block-country-dk:takeoff!@zproxy.lum-superproxy.io:22225',
   # 'https': 'http://lum-customer-c_c304ebd4-zone-static-route_err-block-country-dk:takeoff!@zproxy.lum-superproxy.io:22225'}
   )
scraped_genres = []
artists_genres_dict = {}

def scrape_all_artists_genres():
    #create list with ALL artists

    #write artists to file
    #with open(os.path.join("data_handling","data", "artists.txt"), "w") as new_file:
    #    for g in all_artists:
    #        new_file.write(g + "\n")

    #get all current scraped artists
    already_scraped_artists = os.listdir(os.path.join("data_handling","data", "artist_genres"))
    already_scraped_artists = [word.replace('.json','') for word in already_scraped_artists]

    #get artists to scrape 
    all_artists = []
    with open(os.path.join("data_handling","data", "artists_new.txt")) as f:
        all_artists = f.readlines()
        all_artists = [word.replace('\n','') for word in all_artists]
        all_artists = list(set(all_artists))
        print(":)")

    already_set = set(already_scraped_artists)
    all_set = set(all_artists)
    all_artists = list(all_set-already_set)

    #for e in already_scraped_artists:
    #    try:
    #        all_artists.remove(e)
    #    except Exception as e:
    #        logging.debug(str(e))


    #split list of artists into chunks of 50
    artist_chunks = split_list(all_artists, 50)

    #scrape genres for all artists and add
    for g in artist_chunks:
        chunk_dict = get_multiple_artists_genres(g)
        for artist_id, genres in chunk_dict.items():
            write_artist_genres_to_file(artist_id=artist_id, genres=genres)

def scrape_artist_genres_to_json_files() -> None:
    #get already scraped genres from folder
    scraped_artists = get_genres_from_folder(os.path.join("data_handling", "data", "artist_genres"))

    # get all files
    

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

def open_sqlite():
    unique_artists = set()
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__),"data", "spotify.sqlite"))
    cursor = conn.execute("SELECT id from artists")
    for row in cursor:
        #print("ID = ", row[0])
        #print("NAME = ", row[1], "\n")
        unique_artists.add(row[0])

def main():
    genre_sentences = []
    multi_genre_senteces = []
    
    data = read_json_file(os.path.join(os.path.dirname(__file__),"data", "artists_genres.json"))
    for artist_id, genres in data.items():
        sentence = ""
        for genre in genres:
            genre = genre_formatter(genre)
            sentence = sentence + " " + genre
        sentence = sentence.strip()
        genre_sentences.append(sentence)
    
    distinct_genres = set()
    genres_from_pairs = set()

    single_genre_counter = 0
    pairs_counter = 0
    for sentence in genre_sentences:

        if " " not in sentence:
            single_genre_counter += 1
            distinct_genres.add(sentence)
        else:
            multi_genre_senteces.append(sentence)
            genres = sentence.split(" ")
            for genre in genres:
                distinct_genres.add(genre)
                genres_from_pairs.add(genre)
            n = len(genres)
            pairs = (n*(n-1)/2)
            pairs_counter = pairs_counter + pairs
    
    with open(os.path.join("data_handling", "data", "artists_genre_sentences_NEW.txt"), "w") as new_file:
        for l in multi_genre_senteces:
            new_file.write(l + "\n")

    print("lol")
    

def convert_artist_genres_files_to_one_file():
    #read all files
    all_artist_files = os.listdir(os.path.join("data_handling","data", "artist_genres"))
    all_artist_genres_dict = {}
    counter = 0

    for file in all_artist_files:
        if "DS_Store" not in file:
            counter = counter+1
            content = read_json_file(os.path.join("data_handling","data", "artist_genres", file))
            for key, value in content.items():
                if value:
                    if len(value) > 1:
                        all_artist_genres_dict.update(content)
    
    with open(os.path.join("data_handling", "data", "artists_genres.json"), "w") as new_file:
        new_file.write(json.dumps(all_artist_genres_dict))


def write_artist_genres_to_file(artist_id:str, genres:list[str]) -> None:
    with open(os.path.join("data_handling", "data", "artist_genres", artist_id + ".json"), "w") as new_file:
        artist_to_genres_dict = {}
        artist_to_genres_dict[artist_id] = genres
        new_file.write(json.dumps(artist_to_genres_dict))

def parse_genre_genres() -> dict[str,list[str]]: 
    genre_genres_dict = {}

    # get all files
    files = os.listdir("data_handling/data/genre_genres/")
    for f in files:
        # Opening JSON file
        file = open("data_handling/data/genre_genres/" + f)
        data = json.load(file)
        for genre, genres in data.items():
            genre = convert_string_to_unicode(genre)
            genres = list(map(convert_string_to_unicode, genres))
            while genre.lower() in genres:
                genres.remove(genre.lower())
            genre_genres_dict[genre] = genres
        file.close()
    
    return genre_genres_dict

def convert_string_to_unicode(special_char_string:str) -> str:
    import unidecode
    normalised_string = unidecode.unidecode(special_char_string)
    return normalised_string


def split_list(list:list[str], max_list_size) -> list[list]:
    return [list[i:i + max_list_size] for i in range(0, len(list), max_list_size)] 



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

def get_artists_from_folder(folder_path:str) -> list[str]:
    artists = [] 
    files = os.listdir(folder_path)
    for f in files:
        file_content = read_json_file(os.path.join(folder_path,f))
        artists.extend(list(file_content.values())[0])
    
    artists = list(set(artists))
    return artists

def read_json_file(path:str):
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
    artists_genres_dict = {}
    artists = spotify.artists(artists=artist_ids)
    for artist in artists['artists']:
        if artist:
            if artist['genres']:
                artists_genres_dict[artist['id']] = artist['genres']
            else:
                artists_genres_dict[artist['id']] = []
    return artists_genres_dict
    
def scrape_tracks_from_playlists(spotify:Spotify) -> list[str]:

        genres_playlistIds:dict = read_json_file(os.path.join(os.path.dirname(__file__), "data/genres_playlist.json"))
        for genre_name, playlist_id in genres_playlistIds.items():
            if not exists(os.path.join(os.path.dirname(__file__), f"data/genre_playlist_tracks/{convert_string_to_unicode(genre_name)}.json")):
                playlist = spotify.playlist(playlist_id=playlist_id)
                number_of_tracks = playlist['tracks']['total']
                tracks = []
                for n in range(0, number_of_tracks, 100):
                    track_chunk = spotify.playlist_tracks(playlist_id=playlist_id, offset=n)
                    tracks.extend(track_chunk['items'])
                track_ids = []
                for track in tracks:
                    if track['track']:
                        track_ids.append(track['track']['id'])
                with open(os.path.join(os.path.dirname(__file__), f"data/genre_playlist_tracks/{convert_string_to_unicode(genre_name)}.json"), 'w') as outFile:
                    json.dump({genre_name: track_ids}, outFile)
            

def nomralize_genre_playlists_and_save_to_json():
    genre_playlist_dir = os.path.join(os.path.dirname(__file__), "data/genre_playlist_tracks")
    genre_playlist_dict = {}
    for filename in os.listdir(genre_playlist_dir):
        file = os.path.join(genre_playlist_dir, filename)
        try:
            with open(file) as currentFile:
                genre_playlist:dict = json.load(currentFile)
                normalized_key = genre_formatter(list(genre_playlist.keys())[0])
                genre_playlist_dict[normalized_key] = list(genre_playlist.values())
        except Exception as e:
            continue
    
    with open(os.path.join(os.path.dirname(__file__), "data", "genre_tracks.json"), "w") as outFile:
        json.dump(genre_playlist_dict, outFile)
        outFile.close()

def genre_formatter(genre: str) -> str:
    """
    Translates to ascii, lowercase and replaces symbols
    """
    
    import unidecode
    genre = genre.lower()
    genre = unidecode.unidecode(genre)
    genre = genre.replace(" ", "qqqspcqqq")
    genre = genre.replace("-", "qqqhphnqqq")
    genre = genre.replace("'", "qqqpstrphqqq")
    genre = genre.replace("&", "qqqndqqq")
    genre = genre.replace(":", "qqqclnqqq")
    genre = genre.replace("+", "qqqplsqqq")
    genre = genre.replace("1", "qqqenoqqq")
    genre = genre.replace("2", "qqqowtqqq")
    genre = genre.replace("3", "qqqeerhtqqq")
    genre = genre.replace("4", "qqqruofqqq")
    genre = genre.replace("5", "qqqevifqqq")
    genre = genre.replace("6", "qqqxisqqq")
    genre = genre.replace("7", "qqqnevesqqq")
    genre = genre.replace("8", "qqqthgieqqq")
    genre = genre.replace("9", "qqqeninqqq")
    genre = genre.replace("0", "qqqorezqqq")
    return genre

main()
convert_artist_genres_files_to_one_file()
scrape_all_artists_genres()
#open_sqlite()