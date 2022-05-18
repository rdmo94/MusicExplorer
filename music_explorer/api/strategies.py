import os
import unidecode
import random
from .embeddings import load_vector_space_from_file, unpickle_pickle
from collections import defaultdict
from .graph_util import load_gml_graph
from .util import load_word2vec_model
import networkx as nx


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
    word2vec_model = load_vector_space_from_file()
    all_genres = list(word2vec_model.wv.key_to_index.keys())
    unique_n_random_unfamiliar_genres = set()
    while len(unique_n_random_unfamiliar_genres) != n_genres:
        unique_genre = random.sample(all_genres, 1)[0]
        if unique_genre not in user_genres:
            unique_n_random_unfamiliar_genres.add(unique_genre)
    return list(unique_n_random_unfamiliar_genres)

def furthest_or_closest_genres_old(user_genres: list[str], n_genres=2, furthest:bool=True) -> list[str]:
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

def furthest_or_closest_genres(user_genres: list[str], n_genres=2, furthest:bool=True) -> list[str]:
    # Load word_2_vec model
    w2v_model = load_word2vec_model()
    # Instantiate dict mapping unkown from genres to the shortest distance to them
    genre_to_shortest_distance: dict[str,float] = {}
    for known_genre in user_genres:
        # Look up distances to all other genres in the vector space
        distances = w2v_model.wv.distances(known_genre)         
        for index, distance in enumerate(distances):
            # Get genre from the word2vec model based on index
            genre = w2v_model.wv.index_to_key[index]
            # Add/update the shortest distance to the current genre
            if genre not in user_genres:
                if genre in genre_to_shortest_distance:
                    if distance < genre_to_shortest_distance[genre]:
                        genre_to_shortest_distance[genre] = distance
                else:
                    genre_to_shortest_distance[genre] = distance 

    # Sort the shortest distances based on the parameter "furthest"
    # If furthest == True, then the sorted output is in descending order and vice versa
    sorted_by_distance = dict(sorted(genre_to_shortest_distance.items(), key=lambda item: item[1], reverse=furthest))
    sorted_by_distance_as_list_of_genres = list(sorted_by_distance.keys())
    # Returning only "n-genres" of the sorted list, as defined by the user
    return sorted_by_distance_as_list_of_genres[:n_genres]

def smooth_transition_find_path_from_familiar_to_unfamiliar_genre(source_genre, target_genre, n_genres=2):
    # Load NetworkX graph
    G = load_gml_graph(os.path.join(os.path.dirname(__file__), "data", "networkx_graph.gml"))
    # Load word_2_vec model
    w2v_model = load_word2vec_model()
    # Find path from source to target genre
    shortest_path:list[str] = nx.shortest_path(G, source=source_genre, target=target_genre)

    while len(shortest_path) != n_genres:
        # Instantiate list holding two genres and the distance between them
        genre_pair_distance:list[(str,str,float)] = []
        # Add the distance between every pair in the path
        for index, genre in enumerate(shortest_path):
            if index <= len(shortest_path)-2:
                distance = w2v_model.wv.distance(genre, shortest_path[index+1])
                genre_pair_distance.append((genre, shortest_path[index+1], distance))

        if len(shortest_path) > n_genres:
            # Length is too long - a genre needs to be removed from the path
            # Find shortest path segment
            shortest_tuple = min(genre_pair_distance, key=lambda t: t[2])
            index_of_shortest_distance = genre_pair_distance.index(shortest_tuple)

            if index_of_shortest_distance == 0:
                # If first index remove next index
                del shortest_path[1]
            elif index_of_shortest_distance == len(genre_pair_distance)-1:
                # If last index remove previous index
                del shortest_path[len(shortest_path)-2]
            else:
                # Check the distances to each of their neighbours
                # and remove the genre associated with the shortest
                left_distance = genre_pair_distance[index_of_shortest_distance-1]
                right_distance = genre_pair_distance[index_of_shortest_distance+1]
                
                if left_distance[2] < right_distance[2]:
                    shortest_path.remove(left_distance[1])
                else:
                    shortest_path.remove(right_distance[0])
        else:
            # Length is too short - a genre needs to be added to the path
            # Find longest path segement
            longest_tuple = max(genre_pair_distance, key=lambda t: t[2])
            # Find the most similar genres to the genres sharing the longest path segment
            # topn = the max limit for genres in the path
            most_similar = w2v_model.wv.most_similar(positive=[longest_tuple[0], longest_tuple[1]], topn=51)
            # Add the most similar genre in between the two genres
            for similar in most_similar:
                if similar[0] not in shortest_path:
                    shortest_path.insert(shortest_path.index(longest_tuple[1]), similar[0])
                    break
    return shortest_path