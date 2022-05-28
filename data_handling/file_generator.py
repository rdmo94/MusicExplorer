import json
from operator import indexOf
import os
from types import NoneType

from numpy import vectorize
import embeddings
import data_parser
import graph_util
import spotify_scraper
import similarity_matrix
from sklearn.manifold import TSNE
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def main():
    # print(bcolors.HEADER, "Generating similarity matrix as matrix.json...")
    # print(bcolors.OKBLUE)
    # similarity_matrix.generate_similarity_matrix()

    # # Create new Word2Vec model - tweak parameters here
    # print(bcolors.HEADER, "Creating Word2Vec model...")
    # print(bcolors.OKBLUE)
    word2vec = embeddings.create_Word2Vec_model(sg = 0)
    # print(bcolors.HEADER, "Saving Word2Vec model...")
    # print(bcolors.OKBLUE)
    # embeddings.save_word2vec_model(word2vec)

    # print(bcolors.HEADER, "Generating index_to_genres and vice verca...")
    # print(bcolors.OKBLUE)
    # embeddings.generate_genre_to_index_word2vec()
    # embeddings.generate_index_to_genre_word2vec()
    # word2vec = embeddings.load_word2vec_model()
    # print(bcolors.HEADER, "Generating TSNE-model and datapoints for the graph...")
    # print(bcolors.OKBLUE)
    # pca_2d = embeddings.create_pca_model(vectors=word2vec.wv.vectors, n_components=2)
    tsne_2d: TSNE = embeddings.create_tsne_model(word2vec.wv.vectors, n_components=2)
    containing_rock_points = []
    not_containing_rock_points = []
    for index, value in enumerate(word2vec.wv.index_to_key):
        if "house" in value:
            containing_rock_points.append(tsne_2d[index])
        else:
            not_containing_rock_points.append(tsne_2d[index])
    plt.scatter(np.array(not_containing_rock_points)[:, 0], np.array(not_containing_rock_points)[:, 1], color='blue')
    plt.scatter(np.array(containing_rock_points)[:, 0], np.array(containing_rock_points)[:, 1], color='orange')
    plt.legend(["All other genres", "Genres containing 'House'"])
    # plt.scatter(tsne_2d[:, 0], tsne_2d[:, 1])


    plt.show()
    # tsne_3d = embeddings.create_tsne_model(word2vec.wv.vectors, n_components=3)

    print(bcolors.OKGREEN, "... for 2D ...")
    # print(bcolors.OKBLUE)
    # embeddings.generate_datapoints(pca_2d, n_components=2)
    # embeddings.generate_datapoints(tsne_2d, n_components=2)
    # print(bcolors.OKGREEN, "... for 3D ...")
    # print(bcolors.OKBLUE)
    # embeddings.generate_datapoints(tsne_3d, n_components=3)

    # print(bcolors.HEADER,"Generating graph data file from TSNE-datapoints...")
    # print(bcolors.OKBLUE)
    # print(bcolors.OKGREEN, "... for 2D ...")
    # print(bcolors.OKBLUE)
    # data_parser.generate_graph_data_2d()
    # print(bcolors.OKGREEN, "... for 3D ...")
    # print(bcolors.OKBLUE)
    # data_parser.generate_graph_data_3d()

    # print(bcolors.HEADER,"Generating vector_space_graph.pkl...")
    # print(bcolors.OKBLUE)
    # embeddings.generate_vector_space_graph(word2vec_model=embeddings.load_word2vec_model())

    # TWEAK N_EDGES HERE
    # OPTIMAL_N_EDGES = 6
    # print(bcolors.HEADER,"Generating NetworkX graph from vector space with ... ", OPTIMAL_N_EDGES, " from each genre...")
    # print(bcolors.OKBLUE)
    # G = graph_util.generate_networkx_graph_from_vector_space(n_edges=OPTIMAL_N_EDGES)

    # print(bcolors.HEADER,"Saving NetworkX graph to .gml file...")
    # print(bcolors.OKBLUE)
    # graph_util.save_graph_as_gml(G)

    # print(bcolors.HEADER,"Generating genre_tracks.json...")
    # print(bcolors.OKBLUE)
    # spotify_scraper.nomralize_genre_playlists_and_save_to_json()
  
main()

