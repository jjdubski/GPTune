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
                playlistID=playlist['id'],
                name=playlist['name'],
                description=playlist.get('description', ''),  # Use get() with default value
                coverArt=playlist['images'][0]['url'] if playlist['images'] else None
            )
            logger = logging.getLogger(__name__)
            logger.info(playlist['images'][0]['url'])
            
    
    return Response({"message":"Playlist imported successfully"}, status= 201)

#https://spotipy.readthedocs.io/en/2.19.0/?highlight=saved%20track#spotipy.client.Spotify.current_user_saved_tracks
@api_view(['GET'])
def getSavedSongs(_):
    # if "spotify_token" not in request.session:
    #     return JsonResponse({"error": "User must be logged in to Spotify"}, status=401)
    
    songs = []
    limit = 50
    offset = 0
    try:
        while True:
            results = sp.current_user_saved_tracks(limit=limit, offset=offset)
            songs.extend(results['items'])
            if len(results['items']) < limit:
                break
            offset += limit
    except Exception as e:
        return JsonResponse({"error": f"Failed to get saved songs: {str(e)}"}, status=500)
    playlist, _ = Playlist.objects.get_or_create(
        name="Saved Songs",
        defaults={
            'description': 'Your saved songs from Spotify',
            'coverArt': None
        }
    )
    
    for song in songs:
        track = song['track']
        release_date = track['album']['release_date']
        if release_date:
            release_date_parts = release_date.split('-')
            if len(release_date_parts) == 3:
                release_date = f"{release_date_parts[0]}-{release_date_parts[1]}-{release_date_parts[2]}"
            elif len(release_date_parts) ==  1:
                release_date = f"{release_date_parts[0]}-01-01"
            else:
                release_date = None
                
        playlist.songs.create(
            trackID=track['id'],
            title=track['name'],
            artist=track['artists'][0]['name'],
            album=track['album']['name'],
            release_date=release_date,
            genre=", ".join(track.get('genres', [])),
            coverArt=track['album']['images'][0]['url'] if track['album']['images'] else None
        )
    
    return JsonResponse({"message": "Saved songs imported successfully"}, status=201)
  
#Not used  
# @api_view(['GET'])
# def getPlaylist(request):
#     if "spotify_token" not in request.session:
#         return JsonResponse({"error": "User must be logged in to Spotify"}, status=401)
    
#     results = sp.current_user_playlists()
#     playlists = results['items']
    
#     playlistList = []
#     for playlist in playlists:
#         playlistList.append({
#             'name': playlist['name'],
#             'description': playlist.get('description', ''),
#             'coverArt': playlist['images'][0]['url'] if playlist['images'] else None
#         })
    
#     return JsonResponse(playlistList, safe=False)


#Not used
# def populatePlaylistItems(plalist_id):
#     try:
#         results = sp.playlist_items(plalist_id)
#         songs = results['items']
        
#         for song in songs: 
#             if not Playlist.objects.filter(name=results['name']).exists():
#                 Playlist.objects.create(
#                     trackID=song['id'],
#                     title=song['name'],
#                     artist=song['artists'][0]['name'],
#                     album=song['album']['name'],
#                     release_date=song['album']['release_date'],
#                     genre=", ".join(song.get('genres', [])),
#                     coverArt=song['album']['images'][0]['url'] if song['album']['images'] else None
#                 )
#         return True
#     except Exception as e:
#         logger = logging.getLogger(__name__)
#         logger.error(f"Error populating songs: {str(e)}")
#         return False


@api_view(['GET'])  
def getPlaylistSongs(request, playlist_id):
    try:
        results = sp.playlist_items(playlist_id)
        songs = results['items']
        
        songList = []
        for song in songs:
            track = song['track']
            songList.append({
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'album': track['album']['name'],
                'img': track['album']['images'][0]['url'] if track['album']['images'] else None,
                'previewURL': track['preview_url']
            })
        return JsonResponse(songList, safe=False)
    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Error populating songs: {str(e)}")
        return JsonResponse({"error": "Failed to get songs"}, status=500)
    
