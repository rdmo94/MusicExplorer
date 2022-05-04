import json
from operator import indexOf
import os
import sys
from numpy import short
import numpy as np
import unidecode
import random
from .embeddings import load_vector_space_from_file, unpickle_pickle, get_all_genres_available
from collections import defaultdict
from .graph_util import load_gml_graph
import networkx as nx


def furthest_or_closest_genres(user_genres: list[str], n_genres=2, furthest: bool = True) -> list[str]:
    '''Finds the furthest or closest n genres for each of the user's genre and adds them to a dict and then returns the furthest n genres from that collection.
    If the same genre appears more than once, the distance is accumulated - prioritizing this genre'''
    vector_space_graph_dict = unpickle_pickle()
    # dict[unkown_genre,shortest_distance]
    shortest_distance_to_any_user_genre: dict[str, float] = {}
    for known_genre in user_genres:  # for all unknown genres
        unknown_genre_distances_to_user_genre = vector_space_graph_dict[known_genre]
        for unknown_genre_distance in unknown_genre_distances_to_user_genre:
            unknown_genre = list(unknown_genre_distance.keys())[0]
            if unknown_genre != known_genre:
                if unknown_genre in shortest_distance_to_any_user_genre:
                    # if we already have a shortest distance
                    current_shortest = shortest_distance_to_any_user_genre[unknown_genre]
                    if unknown_genre_distance[unknown_genre] < current_shortest:
                        shortest_distance_to_any_user_genre[unknown_genre] = unknown_genre_distance[unknown_genre]
                else:
                    # no distance added yet -> add
                    shortest_distance_to_any_user_genre[unknown_genre] = unknown_genre_distance[unknown_genre]

    sortedDict = dict(sorted(shortest_distance_to_any_user_genre.items(
    ), key=lambda item: item[1], reverse=furthest))
    genres_in_descending_distance_order = list(sortedDict.keys())

    return genres_in_descending_distance_order[:n_genres]


def a_little_cautious_a_little_curious_closest_unfamiliar_genres(genre: str, user_genres: list[str], n_genres=2) -> list[str]:
    '''Finds the n closest genres not currently appearing on a users collection of genres'''
    vector_space_graph_dict = unpickle_pickle()
    n_closest_genres = sorted(
        vector_space_graph_dict[genre], key=lambda d: list(d.items())[0][1])[:n_genres]
    n_closest_unfamiliar_genres = []
    for genre_distance in n_closest_genres:
        if list(genre_distance.items())[0][0] not in user_genres:
            n_closest_genres.append(genre_distance)
    return n_closest_unfamiliar_genres


def random_choose_n_random_unfamiliar_genres(user_genres, n_genres=2) -> list[str]:
    '''Chooses n random unique genres not currently in the users collection of genres'''
    all_genres = get_all_genres_available()
    unique_n_random_unfamiliar_genres = set()
    while len(unique_n_random_unfamiliar_genres) != n_genres:
        unique_genre = random.sample(all_genres, 1)[0]
        if unique_genre not in user_genres:
            unique_n_random_unfamiliar_genres.add(unique_genre)
    return list(unique_n_random_unfamiliar_genres)


def smooth_transition_find_path_from_familiar_to_unfamiliar_genre(source_genre, target_genre, n_genres=2):
    def load_genre_to_index():
        with open(os.path.join(os.path.dirname(__file__), "data", "genre_to_index_word2vec.json")) as genre_to_index_file:
            genre_to_index = json.load(genre_to_index_file)
            genre_to_index_file.close()
            return genre_to_index

    def load_graph_datapoints() -> list[tuple]:
        with open(os.path.join(os.path.dirname(__file__), "data", "datapoints2D.txt")) as datapoints_file:
            datapoints = []
            for line in datapoints_file.readlines():
                x_y = line.split(",")
                datapoints.append((x_y[0], x_y[1]))
            return datapoints

    genre_to_index = load_genre_to_index()
    datapoints = load_graph_datapoints()

    def add_reduce_path(path:list[str]):
        length = len(shortest_path)
        if length < n_genres:
            longest_path_segment = []
            longest_distance = 0.0
            # Find the longest path segment - linear
            for index, genre in enumerate(path):
                euclidean_dist = np.linalg.norm(np.asarray(
                    datapoints[index])-np.asarray(datapoints[index+1]))
                if euclidean_dist > longest_distance:
                    longest_distance = euclidean_dist
                    longest_path_segment = [genre, path[index+1]]

            # Bruges ikke - 
            # Loop through datapoints to get closest points to the middle of the line
            # middle_x = datapoints[genre_to_index[longest_path_segment[0]]
            #                       ][0] + datapoints[genre_to_index[longest_path_segment[1]]][0]

            # middle_y = datapoints[genre_to_index[longest_path_segment[0]]
            #                       ][1] + datapoints[genre_to_index[longest_path_segment[1]]][1]
            # middle_coord = (middle_x, middle_y)
            
            # Finds the clostest point to the line between the two genres in the longest part of the path
            # Ikke sikkert det er en holdbar måde at gøre det på. Desuden beregnes det her i 2D, hvor pathen er lavet i 50D...
            closest_point_to_longest_path_segment = sys.maxsize
            for point in datapoints:
                distance_to_line = np.cross(datapoints[genre_to_index[longest_path_segment[1]]]-datapoints[genre_to_index[longest_path_segment[0]]], np.asarray(
                    point)-datapoints[genre_to_index[longest_path_segment[0]]])/np.linalg.norm(datapoints[genre_to_index[longest_path_segment[1]]]-datapoints[genre_to_index[longest_path_segment[0]]])
                if distance_to_line < closest_point_to_longest_path_segment:
                    closest_point_to_longest_path_segment = distance_to_line
            
            path.insert(path.index(longest_path_segment[1]), closest_point_to_longest_path_segment)
            add_reduce_path(path)
        elif length > n_genres:
            # Find two shortest path segments and remove the node between them
            # TODO: Do this
            print("")
        else:
            return path
    # Load graph
    G = load_gml_graph(os.path.join(os.path.dirname(
        __file__), "data", "networkx_graph.gml"))

    # Find path from source to target genre
    shortest_path = nx.shortest_path(
        G, source=source_genre, target=target_genre)

    # Return list of genres -- the path
    return add_reduce_path()
