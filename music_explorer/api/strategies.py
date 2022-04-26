import unidecode
import random
from .embeddings import load_vector_space_from_file, load_vector_space_dict_fron_json_file, get_all_genres_available
from collections import defaultdict


def take_me_away_find_furthest_genres_from_genre(user_genres: list[str], n_genres=2) -> list[str]:
    '''Finds the furthest n genres for each of the user's genre and adds them to a dict and then returns the furthest n genres from that collection.
    If the same genre appears more than once, the distance is accumulated - prioritizing this genre'''
    vector_space_graph_dict = load_vector_space_dict_fron_json_file()
    most_distant_genres_overall = defaultdict(float)
    for genre in user_genres:
        genre_distances = vector_space_graph_dict[genre]
        n_most_distant_genres = sorted(genre_distances, key=lambda d: list(d.items())[
                                       0][1], reverse=True)[:n_genres]
        for entry in n_most_distant_genres:
            distant_genre, distance = list(entry.items())[0]
            most_distant_genres_overall[distant_genre] += distance

    return sorted(most_distant_genres_overall.items(), key=lambda d: d[1], reverse=True)[:n_genres]


def a_little_cautious_a_little_curious_closest_unfamiliar_genres(genre: str, user_genres: list[str], n_genres=2) -> list[str]:
    '''Finds the n closest genres not currently appearing on a users collection of genres'''

    vector_space_graph_dict = load_vector_space_dict_fron_json_file()
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
            unique_n_random_unfamiliar_genres.add(
                genre_formatter(unique_genre))
    return list(unique_n_random_unfamiliar_genres)


def smooth_transition_find_path_from_familiar_to_unfamiliar_genre():
    # Load graph
    # Find path from source to target genre
    # Return list of genres -- the path
    raise NotImplementedError("Implement this")


def genre_formatter(genre: str) -> str:
    """
    Translates to ascii, lowercase and replaces symbols
    """
    genre = genre.lower()
    genre = unidecode.unidecode(genre)
    genre = genre.replace(" ", "_spc_")
    genre = genre.replace("-", "_hphn_")
    genre = genre.replace("'", "_pstrph_")
    genre = genre.replace("&", "_nd_")
    genre = genre.replace(":", "_cln_")
    return genre
