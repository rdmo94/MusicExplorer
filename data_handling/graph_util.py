from operator import contains
import networkx as nx
import os
import json
import matplotlib.pyplot as plt
from numpy import inner
import pandas as pd
from embeddings import load_word2vec_model

GRAPH_SIZE = 5755


def generate_networkx_graph_from_vector_space(extended:str="", n_edges=GRAPH_SIZE) -> nx.Graph:
    G = nx.Graph()
    # vector_graph_dataframe = pd.read_pickle(os.path.join(os.path.dirname(__file__), "data", "vector_space_graph.pkl"))
    word2vec_model = load_word2vec_model(filename=f"word_2_vec_model{extended}")

    for outerGenre in word2vec_model.wv.index_to_key:
        topn_most_similar = word2vec_model.wv.most_similar([outerGenre], [], topn=n_edges)
        topn_most_similar_genres = [genre for genre, distance in topn_most_similar]
        distances_to_topn_most_similar = word2vec_model.wv.distances(outerGenre, topn_most_similar_genres)
        for index, innerGenre in enumerate(topn_most_similar_genres):
            if not isinstance(innerGenre, str):
                print("G")
            if not isinstance(innerGenre, str):
                print("G")
            G.add_edge(outerGenre, innerGenre, weight=round(distances_to_topn_most_similar[index], ndigits=5))
    # for outerGenre, links in word2vec_model.wv:
    #     links_distance_desc = sorted(links, key=lambda d: list(d.items())[0][1])
    #     for link in links_distance_desc[1:n_edges+1]:
    #         for innerGenre, distance in link.items():
    #             if contains(outerGenre, "_thgie_") or contains(innerGenre, "_thgie_"):
    #                     print("ggg??")
    #             G.add_edge(outerGenre, innerGenre, weight=distance)

    return G

def save_graph_as_gml(G: nx.Graph, extended:str=""):
    nx.write_gpickle(G, os.path.join("data_handling", "data", f"networkx{extended}.pkl"))
    # nx.write_gml(G, os.path.join("data_handling", "data", f"networkx{extended}.gml"))

def load_gml_graph(extended:str="") -> nx.Graph:
    return nx.read_gml(os.path.join("data_handling", "data", f"networkx{extended}.gml"))
    # return nx.read_gml(os.path.join("data_handling", "data", f"networkx{extended}.gml"))

