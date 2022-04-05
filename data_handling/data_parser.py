import json
import os

def generate_graph_data_2d():
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
        for index, line in enumerate(file.readlines()):
        
            line_in_sections = line.split(",")
            x = int(line_in_sections[0].replace(",", ""))
            y= int(line_in_sections[1].replace(",", "").strip())
            if x < len(nodes) and y < len(nodes):
                links.append({"source" : x, "target": y})

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
    with open(os.path.join("data_handling/data", "datapoints_3d.txt"), "r") as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            line_split = line.split(",")
            nodes.append({"id" : index, "name": index_to_genre[index], "fx" : float(line_split[0]), "fy": float(line_split[1]), "fz": float(line_split[2])})

    # go through the co-occurrence matrix to form the links
    links = []
    with open(os.path.join("data_handling/data", "matrix_txt.txt"), "r") as file: 
        for index, line in enumerate(file.readlines()):
        
            line_in_sections = line.split(",")
            x = int(line_in_sections[0].replace(",", ""))
            y= int(line_in_sections[1].replace(",", "").strip())
            if x < len(nodes) and y < len(nodes):
                links.append({"source" : x, "target": y})

    graph_data = {}
    graph_data["nodes"] = nodes
    graph_data["links"] = links
    with open(os.path.join("data_handling/data", "graph_data_3d.json"), "w") as f:
        json.dump(graph_data, f)

