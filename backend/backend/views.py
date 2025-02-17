from django.http import HttpResponse, JsonResponse
from datetime import datetime

from django.shortcuts import redirect
import spotipy
import os
from spotipy import SpotifyOAuth

from utils.spotifyClient import sp
def index(request):
    current_time = datetime.now().strftime("%H:%M:%S")
    current_date = datetime.now().strftime("%d-%m-%Y")
    currentUser = sp.current_user()

    data = {
        'current_time': current_time,
        'current_date': current_date,
        'user': {
            'id': currentUser['id'],
            'display_name': currentUser['display_name'],
            'email': currentUser['email']
        }
    }

    return JsonResponse(data)

def login(request):
    # Redirect user to Spotify authorization URL
    auth_url = sp.auth_manager.get_authorize_url()
    return redirect(auth_url)

def logout(request):
    request.session.flush()
    return redirect('http://localhost:3000/')

def callback(request):
    code = request.GET.get("code")
    tokenInfo = sp.auth_manager.get_access_token(code)
    
    #to save the spotify token the session keys
    request.session["spotify_token"] = tokenInfo["access_token"]
    
    return redirect('http://localhost:3000/')

def getSong(request):
    #ensure user is logged-in
    if "spotify_token" not in request.session:
        return JsonResponse({"error": "User must be logged in to Spotify"}, status = 401)
    
    results = sp.current_user_top_tracks(limit = 10)
    songs = results['items']
    
    songList = []
    
    for song in songs:
        songList.append({
            'name': song['name'],
            'artist': song['artists'][0]['name'],
            'album': song['album']['name'],
            'previewURL': song['preview_url']
        })
        
    return JsonResponse[songList]