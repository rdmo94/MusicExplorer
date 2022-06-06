from ast import Tuple
from mimetypes import init
from operator import contains
from gensim.test.utils import datapath
from gensim import utils
import gensim.models
import os
import sklearn
from sklearn.manifold import TSNE
import numpy as np
import matplotlib.pyplot as plt
import json
import pandas as pd
from similarity_matrix import get_genre_to_index
from sklearn.decomposition import PCA

class GenreCorpus:
    """An iterator that yields sentences (lists of str)."""

    def __iter__(self):

        corpus_path = os.path.join(
            "data_handling/data", "artists_genre_sentences_NEW.txt")
        # corpus_path = os.path.join(
        #     "data_handling/data", "artists_genre_sentences_word2vec_compatible.txt")
        for line in open(corpus_path):
            # assume there's one document per line, tokens separated by whitespace
            yield utils.simple_preprocess(line, min_len=1, max_len=99)

def create_Word2Vec_model(vector_size=200, window=99, min_count=0, sg=0) -> gensim.models.Word2Vec:
    sentences = GenreCorpus()
    model = gensim.models.Word2Vec(
    sentences=sentences, vector_size=vector_size, window=window, min_count=min_count, sg=sg, epochs=10, negative=10)
    return model

def save_word2vec_model(model:gensim.models.Word2Vec, filename:str):
    model.save(os.path.join(os.path.dirname(__file__), "data", filename))

def load_word2vec_model(filename:str) -> gensim.models.Word2Vec:
    return gensim.models.Word2Vec.load(os.path.join(os.path.dirname(__file__), "data", filename))

def create_tsne_model(vectors, n_components=2, learning_rate='auto', init='random', verbose=0):
    return TSNE(n_components=n_components, early_exaggeration=12, perplexity=60, learning_rate=150, init='random', n_iter=5000).fit_transform(vectors)

def create_pca_model(vectors, n_components=2):
    return PCA(n_components=n_components, svd_solver='full').fit_transform(vectors)

# Old - too slow. Size was approx. 1.35 GB
def generate_vector_space_graph(word2vec_model: gensim.models.Word2Vec):
    graph = {}
    script_dir = os.path.dirname(__file__)

    with open(os.path.join(script_dir, "data/index_to_genre_word2vec.json")) as file:
        data = json.load(file)
        for word in data:
            ## TODO: Make dict of format { "genre" : { "innerGenre" : distance, ... } ... }
            distances = []
            for innerWord in data:
                if contains(innerWord, "_thgie__hphn_bit") or contains(word, "_thgie__hphn_bit"):
                    print("g")
                distances.append({innerWord : word2vec_model.wv.distance(word, innerWord)})
            graph[word] = distances
        file.close()
        dataframe = pd.DataFrame.from_dict(graph)
        dataframe.to_pickle(os.path.join(script_dir, "data", "vector_space_graph.pkl"))
    

def get_x_y_coordinates_from_tsne_model(tsne_model, extended:str, n_components=2):
    index_to_genre = load_index_to_genre_word2vec(extended=extended)
    coordinates = np.empty((len(index_to_genre),n_components))
    x = tsne_model[:, 0]
    coordinates[:, 0] = x
    y = tsne_model[:, 1]
    coordinates[:, 1] = y
    if n_components == 3:
        z = tsne_model[:, 2]
        coordinates[:, 2] = z
    return coordinates
    
def generate_index_to_genre_word2vec(filename:str, extended:str=""):
    with open(os.path.join(
            "data_handling/data", filename), "w") as outfile:
        w2v_model = load_word2vec_model(filename=f"word_2_vec_model{extended}")
        json.dump(w2v_model.wv.index_to_key, outfile)
        outfile.close()

def load_index_to_genre_word2vec(extended:str) -> list[str]:
    with open(os.path.join(
            "data_handling/data", f"index_to_genre_word2vec{extended}.json"), "r") as infile:
        return json.load(infile)

def generate_genre_to_index_word2vec(filename:str, extended:str=""):
    with open(os.path.join(
            "data_handling/data", filename), "w") as outfile:
        w2v_model = load_word2vec_model(filename=f"word_2_vec_model{extended}")
        json.dump(w2v_model.wv.key_to_index, outfile)
        outfile.close()

def load_genre_to_index_word2vec() -> list[str]:
    with open(os.path.join(
            "data_handling/data", "genre_to_index_word2vec.json"), "r") as infile:
        return json.load(infile)

def generate_datapoints(tsne_model, filename:str, extended:str="", n_components=2):
    coordinates = get_x_y_coordinates_from_tsne_model(tsne_model=tsne_model, n_components=n_components, extended=extended)
    with open(os.path.join(
            "data_handling", "data", filename), "w") as outfile:
        for pair in coordinates:
            outfile.write(str(pair[0]) + ",")
            if n_components == 3:
                outfile.write(str(pair[1]) + ",")
                outfile.write(str(pair[2]))
            else:
                outfile.write(str(pair[1]))
            outfile.write("\n")
        outfile.close()

def load_vector_space_from_file(filename="word_2_vec_model") -> gensim.models.Word2Vec:
    return gensim.models.Word2Vec.load(os.path.join(os.path.dirname(__file__), filename))

def load_vector_space_dict_fron_json_file() -> dict:
    script_dir = os.path.dirname(__file__)
    with open(os.path.join(script_dir, "vector_graph.json")) as in_file:
        vector_graph_dict = json.load(in_file)
        return vector_graph_dict

def get_all_genres_available() -> list[str]:
    return list(get_genre_to_index().keys())