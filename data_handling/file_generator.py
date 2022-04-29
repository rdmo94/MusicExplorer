import embeddings
import data_parser
import graph_util

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def main():
    ## Create new Word2Vec model - tweak parameters here
    print(bcolors.HEADER, "Creating Word2Vec model...")
    print(bcolors.OKBLUE)
    word2vec_model = embeddings.create_Word2Vec_model()
    print(bcolors.HEADER, "Saving Word2Vec model...")
    print(bcolors.OKBLUE)
    embeddings.save_word2vec_model(word2vec_model)

    print(bcolors.HEADER, "Generating index_to_genres and vice verca...")
    print(bcolors.OKBLUE)
    embeddings.generate_genre_to_index_word2vec()
    embeddings.generate_index_to_genre_word2vec()

    print(bcolors.HEADER, "Generating TSNE-model and datapoints for the graph...")
    print(bcolors.OKBLUE)
    print(bcolors.OKGREEN, "... for 2D ...")
    print(bcolors.OKBLUE)
    embeddings.generate_datapoints(n_components=2)
    print(bcolors.OKGREEN, "... for 3D ...")
    print(bcolors.OKBLUE)
    embeddings.generate_datapoints(n_components=3)

    print(bcolors.HEADER,"Generating graph data file from TSNE-datapoints...")
    print(bcolors.OKBLUE)
    print(bcolors.OKGREEN, "... for 2D ...")
    print(bcolors.OKBLUE)
    data_parser.generate_graph_data_2d()
    print(bcolors.OKGREEN, "... for 3D ...")
    print(bcolors.OKBLUE)
    data_parser.generate_graph_data_3d()

    print(bcolors.HEADER,"Generating vector_space_graph.pkl...")
    print(bcolors.OKBLUE)
    embeddings.generate_vector_space_graph(word2vec_model=word2vec_model)

    # TWEAK N_EDGES HERE
    OPTIMAL_N_EDGES = 6
    print(bcolors.HEADER,"Generating NetworkX graph from vector space with ... ", OPTIMAL_N_EDGES, " from each genre...")
    print(bcolors.OKBLUE)
    G = graph_util.generate_networkx_graph_from_vector_space(n_edges=OPTIMAL_N_EDGES)

    print(bcolors.HEADER,"Saving NetworkX graph to .gml file...")
    print(bcolors.OKBLUE)
    graph_util.save_graph_as_gml(G)
    
main()