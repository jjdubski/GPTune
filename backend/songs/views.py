from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from songs.models import Song
from songs.serializers import SongSerializer

from utils.spotifyClient import sp


# Create your views here.
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    

    
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
            'img': song['album']['images'][0]['url'] if song['album']['images'] else None,
            'previewURL': song['preview_url']
        })
        
    return JsonResponse[songList]