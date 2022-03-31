from mimetypes import init
from gensim.test.utils import datapath
from gensim import utils
import gensim.models
import os
from sklearn.manifold import TSNE
import numpy as np
import matplotlib.pyplot as plt
import json


class MyCorpus:
    """An iterator that yields sentences (lists of str)."""

    def __iter__(self):

        corpus_path = os.path.join(
            "data_handling/data", "artists_genre_sentences.txt")
        for line in open(corpus_path):
            # assume there's one document per line, tokens separated by whitespace
            yield utils.simple_preprocess(line)


sentences = MyCorpus()
uniques = set()
for i in sentences:
    for j in i:
        uniques.add(j)
model = gensim.models.Word2Vec(
    sentences=sentences, vector_size=50, window=99, min_count=1, sg=1)

# with open("embeddings.txt", "w") as outputFile:
#     for vector in model.wv.vectors:
#         for number in vector:
#             outputFile.write(str(number) + "    ")
#         outputFile.write("\n")
#     outputFile.close()       
        

tsne_model = TSNE(n_components=2, learning_rate='auto',
                  init='random', verbose=1).fit_transform(model.wv.vectors)
print("hey")
x = tsne_model[:, 0]

y = tsne_model[:, 1]

# with open("index_to_genre_word2vec.json", "w") as o:
#     json.dump(model.wv.index_to_key, o)

# with open("genre_to_index_word2vec.json", "w") as o:
#     json.dump(model.wv.key_to_index, o)

# with open("datapoints.txt", "w") as outputFile:
#     for i in range(len(x)):
#         outputFile.write(str(x[i]) + "," + str(y[i]) + "\n")
        
   

plt.scatter(x, y)
for i in range(len(x)):
    test1 = list(model.wv.key_to_index.keys())[i]
    test2 = x[i]
    test3 = y[i]
    # plt.annotate(list(model.wv.key_to_index.keys())[i], (x[i], y[i]))
plt.show()
print("hey")