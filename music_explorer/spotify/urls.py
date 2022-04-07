from django.urls import path

from .repositories.spotify_user_repository import GetCurrentSpotifyUserView

from .views import AuthURL, SpotifyLogout, spotify_callback, IsAuthenticated
from .repositories.playlist_repository import GetCurrentUserPlaylistsView

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('logout', SpotifyLogout.as_view()),
    path('get_playlists', GetCurrentUserPlaylistsView.as_view()),
    path('get_current_user', GetCurrentSpotifyUserView.as_view())

]