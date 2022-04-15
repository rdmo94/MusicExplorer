import networkx as nx
import os
import json
import matplotlib.pyplot as plt

GRAPH_SIZE = 5755

def load_graph_from_json_file(n_edges=GRAPH_SIZE) -> nx.Graph:
    G = nx.Graph()
    script_dir = os.path.dirname(__file__)

    with open(os.path.join(script_dir, "vector_graph.json")) as in_file:
        vector_graph_dict = json.load(in_file)
        for outerGenre, links in vector_graph_dict.items():
            links_distance_desc = sorted(links, key=lambda d: list(d.items())[0][1])
            for link in links_distance_desc[1:n_edges]:
                for innerGenre, distance in link.items():
                    G.add_edge(outerGenre, innerGenre, weight=distance)

    return G
    # with open(os.path.join(script_dir, "data/genre_to_index_word2vec.json")) as file:
    #     G = nx.Graph()
    #     data = json.load(file)
    #     for word in data.keys():
    #         distances = []
    #         for innerWord in data.keys():
    #             distance = word2vec_model.wv.distance(word, innerWord)
    #             G.add_edge(word, innerWord, weight=distance)
    #     file.close()
        
    # with open('vector_graph.json', 'w') as fp:
    #     json.dump(graph, fp)
    #     fp.close()

def save_graph_as_gml(G, filename):
    nx.write_gml(G, filename)

def load_gml_graph(path) -> nx.Graph:
    return nx.read_gml(path)


G = load_graph_from_json_file(n_edges=2)
nx.draw(G)
plt.show()
print("hey")