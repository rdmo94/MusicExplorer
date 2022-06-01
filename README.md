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
-  Install python requirements with the following command:
```
pip install -r requirements.txt
``` 
-  Go to the /frontend subdirectory and run 'npm install' to install all npm packages.

## Backend
- From the /music_explorer subdirectory run the following command:
```
python manage.py runserver
```

to start the server.

## Frontend
- Navigatate to the /frontend subdirectory and run the following command:
```
npm run build
```
to start the frontend server.

### Navigate to the address 127.0.0.1:8000 in your browser
