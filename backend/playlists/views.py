from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Playlist
from .serializers import PlaylistSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.spotifyClient import sp
import logging

# Create your views here.

class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    

@api_view(['GET'])
def AddPlaylists(request):
    if "spotify_token" not in request.session:
        return JsonResponse({"error": "User must be logged in to Spotify"}, status = 401)
    
    results = sp.current_user_playlists()
    playlists = results['items']
    
    for playlist in playlists:
        # Check if playlist already exists
        if not Playlist.objects.filter(name=playlist['name']).exists():
            Playlist.objects.create(
                name=playlist['name'],
                description=playlist.get('description', ''),  # Use get() with default value
                coverArt=playlist['images'][0]['url'] if playlist['images'] else None
            )
            logger = logging.getLogger(__name__)
            logger.info(playlist['images'][0]['url'])
            
    
    return Response({"message":"Playlist imported successfully"}, status= 201)
    
def getPlaylist(request):
    return



def populatePlaylistItems(plalist_id):
    try:
        results = sp.playlist_items(plalist_id)
        songs = results['items']
        
        for song in songs: 
            if not Playlist.objects.filter(name=results['name']).exists():
                Playlist.objects.create(
                    trackID=song['id'],
                    title=song['name'],
                    artist=song['artists'][0]['name'],
                    album=song['album']['name'],
                    release_date=song['album']['release_date'],
                    genre=", ".join(song.get('genres', [])),
                    coverArt=song['album']['images'][0]['url'] if song['album']['images'] else None
                )
        return True
    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Error populating songs: {str(e)}")
        return False
    
    return
