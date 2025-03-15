import json
from urllib import response
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets, generics
from songs.models import Song
from songs.serializers import SongSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

from utils.spotifyClient import sp

# Create your views here.
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    
# class GetSongView(APIView):
#     def post(self, request):
#         serializer = SongSerializer
#         serializer.is_vaild(raise_execption = True)
#         serializer.save()
#         return Response(serializer.data, status = 201)
        
class AddSongView(generics.CreateAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer 

@api_view(['GET'])
def AddSongs(request):
    if "spotify_token" not in request.session:
        return JsonResponse({"error": "User must be logged in to Spotify"}, status = 401)
    
    results = sp.current_user_top_tracks()
    songs = results['items']
    
    
    
    # for song in songs:
    #     songList.append({
    #         'name': song['name'],
    #         'artist': song['artists'][0]['name'],
    #         'album': song['album']['name'],
    #         'img': song['album']['images'][0]['url'] if song['album']['images'] else None,
    #         'previewURL': song['preview_url']
    #     })
    for song in songs:
        if not Song.objects.filter(trackID=song['id']):
                Song.objects.create(
                    trackID = song['id'],
                    title = song['name'],
                    artist = song['artists'][0]['name'],
                    album = song['album']['name'],
                    release_date =song['album'].get('release_date', None),
                    genre = ", ".join(song.get('genres', [])),
                    image = song['album']['images'][0]['url'] if song['album']['images'] else None,
                    uri = song['uri']
                )
    return Response({"message": "Data successfully added!"}, status=201)


#https://spotipy.readthedocs.io/en/2.25.1/#spotipy.client.Spotify.start_playback
@csrf_exempt
def playSong(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            uri = data.get('uri', "").strip().split(',')

            if not uri or all(u == "" for u in uri):
                return JsonResponse({"error": "Missing URI"}, status=400)

            try:
                # Check playback state
                playbackState = sp.current_user_playing_track()

                if not playbackState or not playbackState.get('is_playing'):
                    # Get available devices
                    devices = sp.devices().get('devices', [])
                    #print("Available devices:", devices)

                    if not devices:
                        return JsonResponse({"error": "No active devices found. Please open Spotify on a device."}, status=400)

                    # Select the first available device
                    device_id = devices[0]['id']
                    #print(f"Setting playback to device {device_id}")

                    # Transfer playback to the selected device
                    sp.transfer_playback(device_id, force_play=True)

                # Start playback
                sp.start_playback(uris=uri)
                return JsonResponse({"message": "Song is playing"}, status=200)

            except Exception as e:
                print("Error:", str(e))
                return JsonResponse({"error": str(e)}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)
