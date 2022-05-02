import json
import logging
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from api.models import User
from ..util import filter_spotify_playlist_tracks, filter_spotify_track, get_user_tokens, get_current_user, filter_spotify_playlists, split_list
from requests import post, put, get
from spotipy import Spotify

logging.getLogger('spotipy').setLevel(logging.WARNING)
logging.getLogger('requests').setLevel(logging.WARNING)

class TracksView(GenericAPIView):
    def get(self, request, playlistId=None, format=None):
        if playlistId is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        current_user_response = get_current_user(session_id=request.session.session_key)
        user_tokens = get_user_tokens(session_id=request.session.session_key)

        if current_user_response.ok:
            sp = Spotify(auth=user_tokens.access_token)

            # Limit for number of tracks = 100
            playlist_tracks = sp.playlist_tracks(playlist_id=playlistId)
            filtered_playlists = filter_spotify_playlist_tracks(playlist_tracks)
            return Response(data=json.dumps(filtered_playlists), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        

class TrackView(APIView):
    def get(self, request, track_ids:list[str], format=None):
        if not track_ids:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        current_user_response = get_current_user(session_id=request.session.session_key)
        user_tokens = get_user_tokens(session_id=request.session.session_key)

        if current_user_response.ok:
            sp = Spotify(auth=user_tokens.access_token)
            track_id_chunks = split_list(track_ids, 50) #max 50 track_ids per request
            all_fetched_tracks = []
            all_artist_ids = []
            artist_id_to_artist = {}

            #fetch all tracks
            for track_id_chunk in track_id_chunks:
                track_chunk = sp.tracks(tracks=track_id_chunk)
                if track_chunk['tracks']:
                    all_fetched_tracks.extend(track_chunk['tracks'])
            
            #get all artist id's
            for track in all_fetched_tracks:
                if track['artists']:
                    for artist in track['artists']:
                        all_artist_ids.append(artist['id'])
                        #artist_id_to_artist[artist['id']].append(artist['id'])
            
            #fetch all artists and add to dict
            # artist_id_chunks = split_list(all_artist_ids, 50) #max 50 artists_ids per request
            # all_fetched_artists = []
            # for artist_id_chunk in artist_id_chunks:
            #     artist_chunk = sp.artists(artists=artist_id_chunk)
            #     if artist_chunk['artists']:
            #         for artist in artist_chunk['artists']:
            #             artist_id_to_artist[artist['id']] = artist['name']
                    
            
            #add artist names to tracks
            # for track in all_fetched_tracks:
            #     if track['artists']:
            #         artists_from_track = track['artists']
                    #track['artists'] = artist_id_to_artist[]
                    #for artist_from_track in artists_from_track:


            #add artist names to tracks
            
                        
            filtered_tracks = []
            for track in all_fetched_tracks:
                filtered_tracks.append(filter_spotify_track(track))
            
            #all_fetched_tracks = filter_spotify_playlist_tracks(all_fetched_tracks)

            return Response(data=filtered_tracks, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)