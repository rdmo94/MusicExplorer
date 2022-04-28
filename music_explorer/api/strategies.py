import unidecode
import random
from .embeddings import load_vector_space_from_file, unpickle_pickle, get_all_genres_available
from collections import defaultdict


def take_me_away_find_furthest_genres_from_genre(user_genres: list[str], n_genres=2) -> list[str]:
    '''Finds the furthest n genres for each of the user's genre and adds them to a dict and then returns the furthest n genres from that collection.
    If the same genre appears more than once, the distance is accumulated - prioritizing this genre'''
    vector_space_graph_dict = unpickle_pickle()
    most_distant_genres_overall = defaultdict(float)
    shortest_distance_to_any_user_genre: dict[str,float] = {} #dict[unkown_genre,shortest_distance]
    for known_genre in user_genres: #for all unknown genres
        unknown_genre_distances_to_user_genre = vector_space_graph_dict[known_genre]
        for unknown_genre_distance in unknown_genre_distances_to_user_genre:
            unknown_genre = list(unknown_genre_distance.keys())[0]
            if unknown_genre in shortest_distance_to_any_user_genre: 
                #if we already have a shortest distance
                current_shortest = shortest_distance_to_any_user_genre[unknown_genre]
                if unknown_genre_distance[unknown_genre] < current_shortest:
                    shortest_distance_to_any_user_genre[unknown_genre] = unknown_genre_distance[unknown_genre]
            else:
                #no distance added yet -> add 
                shortest_distance_to_any_user_genre[unknown_genre] = unknown_genre_distance[unknown_genre]

            # if genre in lowest_distance_to_genre:
            #     current_lowest = lowest_distance_to_genre[genre][1]
            #     if model_genre_distance[model_genre_distance_genre] < current_lowest:
            #         if genre != model_genre_distance_genre:
            #             lowest_distance_to_genre[genre] = (model_genre_distance_genre, model_genre_distance[model_genre_distance_genre])
            #     pass #check if this distance is shorter
            # else: #add this distance 
            #     lowest_distance_to_genre[genre] = (model_genre_distance_genre, model_genre_distance[model_genre_distance_genre])

        # n_most_distant_genres = sorted(genre_distances, key=lambda d: list(d.items())[
        #                                0][1], reverse=True)[:n_genres]
        # for entry in n_most_distant_genres:
        #     distant_genre, distance = list(entry.items())[0]
        #     most_distant_genres_overall[distant_genre] += distance
    
    #dict(sorted(x.items(), key=lambda item: item[1]))
    return sorted(most_distant_genres_overall.items(), key=lambda d: d[1], reverse=True)[:n_genres]


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


def smooth_transition_find_path_from_familiar_to_unfamiliar_genre():
    # Load graph
    # Find path from source to target genre
    # Return list of genres -- the path
    raise NotImplementedError("Implement this")
