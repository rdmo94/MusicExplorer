from django.urls import path

from .repositories.spotify_user_repository import GetCurrentSpotifyUser

from .views import AuthURL, SpotifyLogout, spotify_callback, IsAuthenticated
from .repositories.playlist_repository import GetUserPlaylists

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('logout', SpotifyLogout.as_view()),
    path('get_playlists', GetUserPlaylists.as_view()),
    path('get_current_user', GetCurrentSpotifyUser.as_view())

]