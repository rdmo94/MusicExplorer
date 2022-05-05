import os
import unidecode
import random
from .embeddings import load_vector_space_from_file, unpickle_pickle, get_all_genres_available
from collections import defaultdict
from .graph_util import load_gml_graph
from .util import load_word2vec_model
import networkx as nx

def furthest_or_closest_genres(user_genres: list[str], n_genres=2, furthest:bool=True) -> list[str]:
    '''Finds the furthest or closest n genres for each of the user's genre and adds them to a dict and then returns the furthest n genres from that collection.
    If the same genre appears more than once, the distance is accumulated - prioritizing this genre'''
    vector_space_graph_dict = unpickle_pickle()
    shortest_distance_to_any_user_genre: dict[str,float] = {} #dict[unkown_genre,shortest_distance]
    for known_genre in user_genres: #for all unknown genres
        unknown_genre_distances_to_user_genre = vector_space_graph_dict[known_genre]
        for unknown_genre_distance in unknown_genre_distances_to_user_genre:
            unknown_genre = list(unknown_genre_distance.keys())[0]
            if unknown_genre != known_genre:
                if unknown_genre in shortest_distance_to_any_user_genre: 
                    #if we already have a shortest distance
                    current_shortest = shortest_distance_to_any_user_genre[unknown_genre]
                    if unknown_genre_distance[unknown_genre] < current_shortest:
                        shortest_distance_to_any_user_genre[unknown_genre] = unknown_genre_distance[unknown_genre]
                else:
                    #no distance added yet -> add 
                    shortest_distance_to_any_user_genre[unknown_genre] = unknown_genre_distance[unknown_genre]
    
    sortedDict = dict(sorted(shortest_distance_to_any_user_genre.items(), key=lambda item: item[1], reverse=furthest))
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
    # Load graph
    G = load_gml_graph(os.path.join(os.path.dirname(__file__), "data", "networkx_graph.gml"))

    # Find path from source to target genre
    shortest_path:list[str] = nx.shortest_path(G, source=source_genre, target=target_genre)

    #load word_2_vec model
    w2v_model = load_word2vec_model()

    while len(shortest_path) != n_genres:
        #genre_pair_to_distance:dict[tuple[str,str], float] = {}
        genre_pair_distance:list[(str,str,float)] = []
        for index, genre in enumerate(shortest_path):
            #check distance between every pair
            if index <= len(shortest_path)-2:
                #genre_pair_to_distance[(genre, shortest_path[index+1])] = distance
                distance = w2v_model.wv.distance(genre, shortest_path[index+1])
                genre_pair_distance.append((genre, shortest_path[index+1], distance))

        if len(shortest_path) > n_genres:
            #if remove then find shortest distance
            shortest_tuple = min(genre_pair_distance, key=lambda t: t[2])
            index_of_shortest_distance = genre_pair_distance.index(shortest_tuple)

            if index_of_shortest_distance == 0:
                #if first index remove next index
                del shortest_path[1]
            elif index_of_shortest_distance == len(genre_pair_distance)-1:
                #if last index remove previous index
                del shortest_path[len(shortest_path)-2]
            else:
                #check previous and next distance
                #left = index 0
                #right = index 1
                left_distance = genre_pair_distance[index_of_shortest_distance-1]
                right_distance = genre_pair_distance[index_of_shortest_distance+1]

                if left_distance[2] < right_distance[2]:
                    print("Removing ", left_distance[1], " from shortest path!")
                    shortest_path.remove(left_distance[1])
                else:
                    print("Removing ", right_distance[0], " from shortest path!")
                    shortest_path.remove(right_distance[0])
        else:
            #if add then find longest distance
            longest_tuple = max(genre_pair_distance, key=lambda t: t[2])
            most_similar = w2v_model.wv.most_similar(positive=[longest_tuple[0], longest_tuple[1]], topn=51) # Must correspond with the max limit of n_genres in the frontend +1
            print("Adding genre ", most_similar[0], " to shortest path")
            for similar in most_similar:
                if similar[0] not in shortest_path:
                    shortest_path.insert(shortest_path.index(longest_tuple[1]), similar[0])
                    break

                
    
    return shortest_path