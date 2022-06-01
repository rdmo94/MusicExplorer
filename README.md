# MusicXplorer
Master Thesis project 2022 - Sean Wachs & Rasmus Dilling Møller

# Folder contents

## data_handling
The folder containing python code used to collect and proccess data, create co-occurrence matrix, train a word2vec model and using TSNE and PCA to reduce dimensionality.

file_generator.py is a script running all code necessary for producing the needed files used in MusicXplorer.

### data
This folder contains files produced and used in the flow of creating the word2vec model and TSNE, PCA and co-occurrence matrix.
## music_explorer
The application folder.

### api
The application folder for the API handling platform specific requests.

#### data
This folder contains statis data used for computations made in this API. 
- A file fontaining all track ids of tracks listen on the playlists for each genre on Spotify.
- A file containing the underlying network graph for findings a path.
- A file containing the word2vec model.

### spotify
The application folder for the API handling Spotify specific requests.

#### static data
- A file containing the 2D coordinates for all genres being visualised
- A file containing the 3D coordinates for all genres being visualised

# How to run
cd /music_explorer

## Backend
python manage.py runserver

## Frontend
cd /frontend
npm run build

Navigate to 127.0.0.1:8000 in your browser
