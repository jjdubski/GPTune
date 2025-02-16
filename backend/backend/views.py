from django.http import HttpResponse, JsonResponse
from datetime import datetime

from django.shortcuts import redirect
import spotipy
import os
from spotipy import SpotifyOAuth

sp_oauth = SpotifyOAuth(
    client_id = os.getenv("DJANGO_APP_SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("DJANGO_APP_SPOTIFY_SECRET"),
    redirect_uri="http://localhost:8000/callback",
    scope="user-library-read"
)



def index(request):
    current_time = datetime.now().strftime("%H:%M:%S")
    current_date = datetime.now().strftime("%d-%m-%Y")

    data = {
        'current_time': current_time,
        'current_date': current_date
    }
    
    return JsonResponse(data)

def login(request):
    # Redirect user to Spotify authorization URL
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

def callback(request):
    code = request.GET.get("code")
    tokenInfo = sp_oauth.get_access_token(code)
    
    #to save the spotify token the session keys
    request.session["spotify_token"] = tokenInfo["access_token"]
    
    return redirect('/')