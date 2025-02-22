# backend/utils/spotify_client.py
import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth

auth_manager = SpotifyOAuth(
    client_id=os.getenv("DJANGO_APP_SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("DJANGO_APP_SPOTIFY_SECRET"),
    redirect_uri="http://localhost:8000/callback",
    scope="user-library-read user-read-email user-top-read user-read-private user-follow-read"
)
# token = auth_manager.get_access_token()
sp = Spotify(auth_manager=auth_manager)
