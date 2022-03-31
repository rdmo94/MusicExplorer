import json
import os

def parse_cooccurrence_matrix():
    # get genre list with index
    index_to_genre = []
    with open(os.path.join("data_handling/data" ,"index_to_genre_word2vec.json"), "r") as f:
        index_to_genre = json.load(f)

    # get points in datapoints.txt
    nodes = []
    with open(os.path.join("data_handling/data", "datapoints.txt"), "r") as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            line_split = line.split(",")
            nodes.append({"id" : index, "name": index_to_genre[index], "fx" : float(line_split[0].replace(",", "")), "fy": float(line_split[1].replace(",", ""))})

    # go through the co-occurrence matrix to form the links
    links = []
    with open(os.path.join("data_handling/data", "matrix_txt.txt"), "r") as file: 
        for line in file.readlines():
            line_in_sections = line.split(",")
            links.append({"source" : int(line_in_sections[0].replace(",", "")), "target": int(line_in_sections[1].replace(",", "").strip())})

    graph_data = {}
    graph_data["nodes"] = nodes
    graph_data["links"] = links
    with open(os.path.join("data_handling/data", "graph_data_1.json"), "w") as f:
        json.dump(graph_data, f)
    print("blob")

parse_cooccurrence_matrix()