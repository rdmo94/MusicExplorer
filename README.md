# MusicExplorer
Master Thesis project 2022

# create new virtualenv
pip3 install virtualenv
virtualenv "name" -p python3

# activate venv
source venv/bin/activate
deactivate


# migrations
python manage.py makemigrations
python manage.py migrate

# npm
npm init -y
npm i webpack webpack-cli --save-dev
npm i react react-dom --save-dev
npm install @material-ui/core
npm install react-router-dom
npm install @material-ui/icons

npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev

sudo npm i @babel/plugin-proposal-class-properties