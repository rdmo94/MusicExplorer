# MusicExplorer
Master Thesis project 2022

# Folder contents

## data_handling
The folder containing python code used to collect and proccess data, create co-occurrence matrix, train a word2vec model and using TSNE to reduce dimensionality.

### data
## music_explorer
The application folder.

# How to run
cd /music_explorer
Change the redirect uri to 127.0.0.1:8000 in /spotify/credentials.py before running locally

## Backend
python manage.py runserver

## Frontend
cd /frontend
npm run build

Navigate to 127.0.0.1:8000 in your browser
