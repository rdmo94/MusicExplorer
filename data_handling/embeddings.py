from ast import Tuple
from mimetypes import init
from gensim.test.utils import datapath
from gensim import utils
import gensim.models
import os
from sklearn.manifold import TSNE
import numpy as np
import matplotlib.pyplot as plt
import json
import pandas as pd
from similarity_matrix import get_genre_to_index


class GenreCorpus:
    """An iterator that yields sentences (lists of str)."""

    def __iter__(self):

        corpus_path = os.path.join(
            "data_handling/data", "artists_genre_sentences.txt")
        for line in open(corpus_path):
            # assume there's one document per line, tokens separated by whitespace
            yield utils.simple_preprocess(line, min_len=1, max_len=99)

def create_Word2Vec_model(vector_size=50, window=99, min_count=0, sg=1) -> gensim.models.Word2Vec:
    sentences = GenreCorpus()
    model = gensim.models.Word2Vec(
    sentences=sentences, vector_size=vector_size, window=window, min_count=min_count, sg=sg)
    return model

def save_word2vec_model(model:gensim.models.Word2Vec):
    # with open(os.path.join(os.path.dirname(__file__), "data", "word2vec_model"), "w") as outfile:
        model.save(os.path.join(os.path.dirname(__file__), "data", "word2vec_model"))
    # outfile.close()

def load_word2vec_model() -> gensim.models.Word2Vec:
    return gensim.models.Word2Vec.load(os.path.join(os.path.dirname(__file__), "data", "word2vec_model"))

def create_tsne_model(word2vec_model, n_components=2, learning_rate='auto', init='random', verbose=0):
    tsne_model = TSNE(n_components=3, learning_rate='auto',
                  init='random', verbose=1).fit_transform(word2vec_model.wv.vectors)
    return tsne_model

# Old - too slow. Size was approx. 1.35 GB
def generate_vector_space_graph(word2vec_model: gensim.models.Word2Vec):
    graph = {}
    script_dir = os.path.dirname(__file__)

    with open(os.path.join(script_dir, "data/index_to_genre_word2vec.json")) as file:
        data = json.load(file)
        for word in data:
            distances = []
            for innerWord in data:
                distances.append({innerWord : word2vec_model.wv.distance(word, innerWord)})
            graph[word] = distances
        file.close()
        
    # with open(os.path.join(script_dir, "data", "vector_graph"), 'w') as fp:
        dataframe = pd.DataFrame.from_dict(graph)
        dataframe.to_pickle("vector_graph.pkl")
        # json.dump(graph, fp)
        # fp.close()

def get_x_y_coordinates_from_tsne_model(tsne_model, n_components=2):
    coordinates = np.empty((5755,n_components))
    x = tsne_model[:, 0]
    coordinates[:, 0] = x
    y = tsne_model[:, 1]
    coordinates[:, 1] = y
    if n_components == 3:
        z = tsne_model[:, 2]
        coordinates[:, 2] = z
    return coordinates
    
def generate_index_to_genre_word2vec():
    with open(os.path.join(
            "data_handling/data", "index_to_genre_word2vec.json"), "w") as outfile:
        w2v_model = load_word2vec_model()
        json.dump(w2v_model.wv.index_to_key, outfile)
        outfile.close()

def generate_genre_to_index_word2vec():
    with open(os.path.join(
            "data_handling/data", "genre_to_index_word2vec.json"), "w") as outfile:
        w2v_model = load_word2vec_model()
        json.dump(w2v_model.wv.key_to_index, outfile)
        outfile.close()

def generate_datapoints(n_components=2):
    w2v_model = load_word2vec_model()
    tsne_model = create_tsne_model(word2vec_model=w2v_model, n_components=n_components)
    coordinates = get_x_y_coordinates_from_tsne_model(tsne_model=tsne_model, n_components=n_components)
    with open(os.path.join(
            "data_handling", "data", f"datapoints{n_components}D.txt"), "w") as outfile:
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


# model = create_Word2Vec_model(min_count=1, sg=0)
# save_word2vec_model(model)

# generate_index_to_genre_word2vec()
# tsne_model_2d = create_tsne_model(model)
# tsne_model_3d = create_tsne_model(model, n_components=3)

# generate_datapoints()
# generate_datapoints(n_components=3)

generate_vector_space_graph(load_word2vec_model())

