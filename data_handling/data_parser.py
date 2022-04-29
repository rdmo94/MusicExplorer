import json
import os
import spotify_scraper

def generate_graph_data_2d():
    # get genre list with index
    index_to_genre = []
    with open(os.path.join("data_handling/data" ,"index_to_genre_word2vec.json"), "r") as f:
        index_to_genre = json.load(f)

    # get points in datapoints.txt
    nodes = []
    with open(os.path.join("data_handling/data", "datapoints2D.txt"), "r") as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            line_split = line.split(",")
            nodes.append({"id" : index, "name": index_to_genre[index], "fx" : float(line_split[0].replace(",", "")), "fy": float(line_split[1].replace(",", ""))})

    # go through the co-occurrence matrix to form the links
    links = []
    # with open(os.path.join("data_handling/data", "matrix_txt.txt"), "r") as file: 
    #     for index, line in enumerate(file.readlines()):
        
    #         line_in_sections = line.split(",")
    #         x = int(line_in_sections[0].replace(",", ""))
    #         y= int(line_in_sections[1].replace(",", "").strip())
    #         if x < len(nodes) and y < len(nodes):
    #             links.append({"source" : x, "target": y})

    graph_data = {}
    graph_data["nodes"] = nodes
    graph_data["links"] = links
    with open(os.path.join("data_handling/data", "graph_data_2d.json"), "w") as f:
        json.dump(graph_data, f)


def generate_graph_data_3d():
    # get genre list with index
    index_to_genre = []
    with open(os.path.join("data_handling/data" ,"index_to_genre_word2vec.json"), "r") as f:
        index_to_genre = json.load(f)

    # get points in datapoints.txt
    nodes = []
    with open(os.path.join("data_handling/data", "datapoints3D.txt"), "r") as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            line_split = line.split(",")
            nodes.append({"id" : index, "name": index_to_genre[index], "fx" : float(line_split[0]), "fy": float(line_split[1]), "fz": float(line_split[2])})

    # go through the co-occurrence matrix to form the links
    links = []
    # with open(os.path.join("data_handling/data", "matrix_txt.txt"), "r") as file: 
    #     for index, line in enumerate(file.readlines()):
        
    #         line_in_sections = line.split(",")
    #         x = int(line_in_sections[0].replace(",", ""))
    #         y= int(line_in_sections[1].replace(",", "").strip())
    #         if x < len(nodes) and y < len(nodes):
    #             links.append({"source" : x, "target": y}) 

    graph_data = {}
    graph_data["nodes"] = nodes
    graph_data["links"] = links
    with open(os.path.join("data_handling/data", "graph_data_3d.json"), "w") as f:
        json.dump(graph_data, f)


def parse_artist_genres_and_convert_to_word2vec_readable():
    formatted_artists_genres = {}
    artists_genres = spotify_scraper.read_json_file(os.path.join(os.path.dirname(__file__), "data", "artists_genres_old.json"))
    for artist, genres in artists_genres.items():
        formatted_genres = []
        for genre in genres:
            formatted_genres.append(genre_formatter(genre))
        formatted_artists_genres[artist] = formatted_genres
    
    with open(os.path.join(os.path.dirname(__file__), "data", "artists_genres_word2vec_compatible.json"), "w") as outfile:
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
    genre = genre.replace(" ", "_spc_")
    genre = genre.replace("-", "_hphn_")
    genre = genre.replace("'", "_pstrph_")
    genre = genre.replace("&", "_nd_")
    genre = genre.replace(":", "_cln_")
    genre = genre.replace("+", "_pls_")
    genre = genre.replace("1", "_eno_")
    genre = genre.replace("2", "_owt_")
    genre = genre.replace("3", "_eerht_")
    genre = genre.replace("4", "_ruof_")
    genre = genre.replace("5", "_evif_")
    genre = genre.replace("6", "_xis_")
    genre = genre.replace("7", "_neves_")
    genre = genre.replace("8", "_thgie_")
    genre = genre.replace("9", "_enin_")
    genre = genre.replace("0", "_orez_")
    return genre
             

# generate_graph_data_2d()
# generate_graph_data_3d()

# parse_artist_genres_and_convert_to_word2vec_readable()
# parse_artist_genre_sentences_and_convert_to_word2vec_readable()