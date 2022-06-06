import json
import os
import spotify_scraper

def generate_graph_data_2d(filename:str, extended:str=""):
    # get genre list with index
    index_to_genre = []
    with open(os.path.join("data_handling/data" , f"index_to_genre_word2vec{extended}.json"), "r") as f:
        index_to_genre = json.load(f)
        f.close()
    
    with open(os.path.join("data_handling/data" ,f"matrix{extended}.json"), "r") as f:
        matrix = json.load(f)
        f.close()

    # get points in datapoints.txt
    nodes = []
    with open(os.path.join("data_handling/data", f"datapoints2D{extended}.txt"), "r") as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            line_split = line.split(",")
            try:
                _sum = sum(matrix[index_to_genre[index]].values())
                nodes.append({"id" : index, "name": index_to_genre[index], "fx" : float(line_split[0].replace(",", "")), "fy": float(line_split[1].replace(",", "")), "weight" : _sum})
            except Exception as e:
                print("g")    
        f.close()
    # go through the co-occurrence matrix to form the links
    links = []
    graph_data = {}
    graph_data["nodes"] = nodes
    graph_data["links"] = links
    with open(os.path.join("data_handling/data", filename), "w") as f:
        json.dump(graph_data, f)
        f.close()

def generate_graph_data_3d(filename:str, extended:str=""):
    # get genre list with index
    index_to_genre = []
    with open(os.path.join("data_handling/data" ,f"index_to_genre_word2vec{extended}.json"), "r") as f:
        index_to_genre = json.load(f)
        f.close()

    with open(os.path.join("data_handling/data" , f"matrix{extended}.json"), "r") as f:
        matrix = json.load(f)
        f.close()
    # get points in datapoints.txt
    nodes = []
    with open(os.path.join("data_handling/data", f"datapoints3D{extended}.txt"), "r") as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            line_split = line.split(",")
            _sum = sum(matrix[index_to_genre[index]].values())

            nodes.append({"id" : index, "name": index_to_genre[index], "fx" : float(line_split[0]), "fy": float(line_split[1]), "fz": float(line_split[2]), "weight" : _sum})
        f.close()
    # go through the co-occurrence matrix to form the links
    links = []
    graph_data = {}
    graph_data["nodes"] = nodes
    graph_data["links"] = links
    with open(os.path.join("data_handling/data", filename), "w") as f:
        json.dump(graph_data, f)
        f.close()

def parse_artist_genres_and_convert_to_word2vec_readable():
    formatted_artists_genres = {}
    artists_genres = spotify_scraper.read_json_file(os.path.join(os.path.dirname(__file__), "data", "artists_genres_extended.json"))
    for artist, genres in artists_genres.items():
        formatted_genres = []
        for genre in genres:
            formatted_genres.append(genre_formatter(genre))
        formatted_artists_genres[artist] = formatted_genres
    
    with open(os.path.join(os.path.dirname(__file__), "data", "artists_genres_word2vec_compatible:extended.json"), "w") as outfile:
        json.dump(formatted_artists_genres, outfile)
        outfile.close()

def parse_artist_genre_sentences_and_convert_to_word2vec_readable():
    formatted_sentences = []
    
    with open(os.path.join(os.path.dirname(__file__), "data", "artists_genre_sentences.txt"), "r") as sentences:
        for line in sentences:
            formatted_sentence = []
            for genre in line.split():
                formatted_sentence.append(genre_formatter(genre))
            formatted_sentences.append(' '.join(formatted_sentence) + "\n")
    with open(os.path.join(os.path.dirname(__file__), "data", "artists_genre_sentences_word2vec_compatible.txt"), "w") as outfile:
        outfile.writelines(formatted_sentences)
        outfile.close()


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

