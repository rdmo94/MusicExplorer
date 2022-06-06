from fileinput import filename
from operator import indexOf
import os
from types import NoneType
from numpy import vectorize
from embeddings import load_word2vec_model
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
    # similarity_matrix.generate_similarity_matrix(extended="_extended")

    # Train new Word2Vec model - tweak parameters here
    # print(bcolors.HEADER, "Training Word2Vec model...")
    # print(bcolors.OKBLUE)
    # word2vec = embeddings.create_Word2Vec_model(sg = 0)
    # word2vec = load_word2vec_model("word_2_vec_model_extended")
    # print(bcolors.HEADER, "Saving Word2Vec model...")
    # print(bcolors.OKBLUE)
    # embeddings.save_word2vec_model(word2vec, filename="word_2_vec_model_extended")
    # embeddings.save_word2vec_model(word2vec, filename="word_2_vec_model_extended")

    # print(bcolors.HEADER, "Generating index_to_genres and vice verca...")
    # print(bcolors.OKBLUE)
    # embeddings.generate_genre_to_index_word2vec(filename="genre_to_index_word2vec.json")
    # embeddings.generate_genre_to_index_word2vec(filename="genre_to_index_word2vec_extended.json", extended="_extended")
    # embeddings.generate_index_to_genre_word2vec(filename="index_to_genre_word2vec.json")
    # embeddings.generate_index_to_genre_word2vec(filename="index_to_genre_word2vec_extended.json", extended="_extended")
    
    # print(bcolors.HEADER, "Generating TSNE-model and datapoints for the graph...")
    # print(bcolors.OKBLUE)

    # print(bcolors.OKGREEN, "... for 2D ...")
    # print(bcolors.OKBLUE)
    # tsne_2d = embeddings.create_tsne_model(word2vec.wv.vectors, n_components=2)

    # embeddings.generate_datapoints(tsne_2d, filename="datapoints2D.txt", n_components=2)
    # embeddings.generate_datapoints(tsne_2d, filename="datapoints2D_extended.txt", extended="_extended", n_components=2)

    # print(bcolors.OKGREEN, "... for 3D ...")
    # print(bcolors.OKBLUE)
    # tsne_3d = embeddings.create_tsne_model(word2vec.wv.vectors,  n_components=3)

    # embeddings.generate_datapoints(tsne_3d, filename="datapoints3D.txt", n_components=3)
    # embeddings.generate_datapoints(tsne_3d, filename="datapoints3D_extended.txt", extended="_extended", n_components=3)

    # print(bcolors.HEADER,"Generating graph data file from TSNE-datapoints...")
    # print(bcolors.OKBLUE)

    # print(bcolors.OKGREEN, "... for 2D ...")
    # print(bcolors.OKBLUE)
    # data_parser.generate_graph_data_2d(filename="graph_data_2d.json")
    # data_parser.generate_graph_data_2d(filename="graph_data_2d_extended.json", extended="_extended")

    # print(bcolors.OKGREEN, "... for 3D ...")
    # print(bcolors.OKBLUE)
    # data_parser.generate_graph_data_3d(filename="graph_data_3d.json")
    # data_parser.generate_graph_data_3d(filename="graph_data_3d_extended.json", extended="_extended")

    # TWEAK N_EDGES HERE
    OPTIMAL_N_EDGES = 6
    print(bcolors.HEADER,"Generating NetworkX graph from vector space with ... ", OPTIMAL_N_EDGES, " from each genre...")
    print(bcolors.OKBLUE)
    # G = graph_util.generate_networkx_graph_from_vector_space(n_edges=OPTIMAL_N_EDGES)
    G = graph_util.generate_networkx_graph_from_vector_space(extended="_extended",n_edges=OPTIMAL_N_EDGES)

    print(bcolors.HEADER,"Saving NetworkX graph to .gml file...")
    print(bcolors.OKBLUE)
    graph_util.save_graph_as_gml(G, extended="_extended")
    print("g")
    # print(bcolors.HEADER,"Generating genre_tracks.json...")
    # print(bcolors.OKBLUE)
    # spotify_scraper.normalize_genre_playlists_and_save_to_json()
  
main()

