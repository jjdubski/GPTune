import logging
import json
from datetime import datetime
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect, render
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from playlists.models import Playlist
from songs.models import Song
import spotipy
from utils.spotifyClient import sp
from utils import openai_client
from utils.openai_client import openai_client  # Use OpenAI client from utils

logger = logging.getLogger(__name__)

@csrf_exempt
def recommend_songs(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            # Safely get values, defaulting to empty list if missing
            top_artists = data.get("top_artists", [])
            top_genres = data.get("top_genres", [])

            if not top_artists:
                return JsonResponse({"error": "Missing 'top_artists' field"}, status=400)

            # Call OpenAI function
            recommendations = openai_client.generate_recommendations({
                "top_artists": top_artists,
                "top_genres": top_genres
            })
            
            return JsonResponse({"recommendations": recommendations})
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def index(request):
    """
    Returns the current time, date, and Spotify user info.
    """
    current_time = datetime.now().strftime("%H:%M:%S")
    current_date = datetime.now().strftime("%d-%m-%Y")
    
    current_user = sp.current_user() if sp.auth_manager.get_cached_token() else {
        'id': None,
        'display_name': "None",
        'email': "None"
    }

    return JsonResponse({
        'current_time': current_time,
        'current_date': current_date,
        'user': {
            'id': current_user['id'],
            'display_name': current_user['display_name'],
            'email': current_user['email']
        }
    })


def login(request):
    """
    Redirects user to Spotify authorization URL.
    """
    return redirect(sp.auth_manager.get_authorize_url())


def logout(request):
    """
    Logs out user, clears session and database.
    """
    request.session.flush()
    sp.auth_manager.cache_handler.delete_cached_token()

    # Cleanup database
    Song.objects.all().delete()
    Playlist.objects.all().delete()
    
    return redirect('http://localhost:3000/')


def callback(request):
    """
    Handles Spotify OAuth callback.
    """
    try:
        code = request.GET.get("code")
        if not code:
            logger.error("No authorization code provided")
            return HttpResponse("No authorization code provided", status=400)

        token_info = sp.auth_manager.get_access_token(code)
        if token_info:
            request.session["token_info"] = token_info
            populatePlaylist()
            populateSongs()
            return redirect("http://localhost:3000/")
        else:
            logger.error("Failed to retrieve access token")
            return HttpResponse("Failed to retrieve access token", status=500)
    
    except spotipy.SpotifyException as e:
        logger.error(f"Spotify API error: {str(e)}")
        return HttpResponse(f"Spotify API error: {str(e)}", status=500)
    except Exception as e:
        logger.error(f"Error in callback: {str(e)}")
        return JsonResponse({"error": "Authentication failed"}, status=500)


def populateSongs():
    """
    Populates the Song model with user's top tracks from Spotify.
    """
    try:
        results = sp.current_user_top_tracks()
        for song in results.get('items', []):
            if not Song.objects.filter(trackID=song['id']).exists():
                release_date = datetime.strptime(song['album']['release_date'], '%Y-%m-%d').date()
                Song.objects.create(
                    trackID=song['id'],
                    title=song['name'],
                    artist=song['artists'][0]['name'],
                    album=song['album']['name'],
                    release_date=release_date,
                    genre=", ".join(song.get('genres', [])),
                    coverArt=song['album']['images'][0]['url'] if song['album']['images'] else None
                )
    except Exception as e:
        logger.error(f"Error populating songs: {str(e)}")


def populatePlaylist():
    """
    Populates the Playlist model with user's Spotify playlists.
    """
    try:
        results = sp.current_user_playlists()
        for playlist in results.get('items', []):
            if not Playlist.objects.filter(name=playlist['name']).exists():
                Playlist.objects.create(
                    name=playlist['name'],
                    description=playlist.get('description', ''),
                    coverArt=playlist['images'][0]['url'] if playlist['images'] else None
                )
                logger.info(f"Playlist added: {playlist['name']}")
    except Exception as e:
        logger.error(f"Error populating playlists: {str(e)}")


def getToken(request):
    """
    Retrieves and returns the Spotify auth token.
    """
    token_info = sp.auth_manager.get_cached_token()
    return JsonResponse(token_info if token_info else {"error": "No token found"}, status=200 if token_info else 404)
