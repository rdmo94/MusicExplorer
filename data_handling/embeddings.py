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


class GenreCorpus:
    """An iterator that yields sentences (lists of str)."""

    def __iter__(self):

        corpus_path = os.path.join(
            "data_handling/data", "artists_genre_sentences.txt")
        for line in open(corpus_path):
            # assume there's one document per line, tokens separated by whitespace
            yield utils.simple_preprocess(line)



def create_Word2Vec_model(vector_size=50, window=99, min_count=1, sg=1) -> gensim.models.Word2Vec:
    sentences = GenreCorpus()
    model = gensim.models.Word2Vec(
    sentences=sentences, vector_size=vector_size, window=window, min_count=min_count, sg=sg)
    return model


def create_tsne_model(word2vec_model, n_components=2, learning_rate='auto', init='random', verbose=0):
    tsne_model = TSNE(n_components=3, learning_rate='auto',
                  init='random', verbose=1).fit_transform(word2vec_model.wv.vectors)
    return tsne_model

def get_x_y_coordinates_from_tsne_model(tsne_model, n_components=2):
    coordinates = np.empty()
    x = tsne_model[:, 0]
    coordinates[:, 0] = x
    y = tsne_model[:, 1]
    coordinates[:, 1] = y
    if n_components == 3:
        z = tsne_model[:, 2]
        coordinates[:, 1] = z
    return coordinates
    