from operator import contains
import networkx as nx
import os
import json
import matplotlib.pyplot as plt
from numpy import inner
import pandas as pd

GRAPH_SIZE = 5755


def generate_networkx_graph_from_vector_space(n_edges=GRAPH_SIZE) -> nx.Graph:
    G = nx.Graph()
    vector_graph_dataframe = pd.read_pickle(os.path.join(os.path.dirname(__file__), "data", "vector_space_graph.pkl"))

    for outerGenre, links in vector_graph_dataframe.items():
        links_distance_desc = sorted(links, key=lambda d: list(d.items())[0][1])
        for link in links_distance_desc[1:n_edges+1]:
            for innerGenre, distance in link.items():
                if contains(outerGenre, "_thgie_") or contains(innerGenre, "_thgie_"):
                        print("ggg??")
                G.add_edge(outerGenre, innerGenre, weight=distance)

    return G

def save_graph_as_gml(G: nx.Graph):
    
    nx.write_gml(G, os.path.join("data_handling", "data", "networkx.gml"))

def load_gml_graph() -> nx.Graph:
    return nx.read_gml(os.path.join("data_handling", "data", "networkx.gml"))