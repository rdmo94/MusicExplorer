from django.urls import path

from .controllers.track_controller import TrackView

from .controllers.spotify_user_controller import GetCurrentSpotifyUserView

from .views import AuthURL, SpotifyLogout, spotify_callback, IsAuthenticated
from .controllers.playlist_controller import CreatePlaylistView, GetCurrentUserPlaylistsView, GetPlaylistGenresView

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('logout', SpotifyLogout.as_view()),
    path('get_playlists', GetCurrentUserPlaylistsView.as_view()),
    path('get_playlist_genres', GetPlaylistGenresView.as_view()),
    path('get_current_user', GetCurrentSpotifyUserView.as_view()),
    path('tracks/<str:playlistId>', TrackView.as_view()),
    path('playlist/save', CreatePlaylistView.as_view()),


]