from datetime import datetime, timedelta
from django.core.cache import cache
import json
import os
from urllib import response
from django.http import JsonResponse
from django.shortcuts import render
import requests
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
    
class AddSongView(generics.CreateAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer 

@api_view(['GET'])
def AddSongs(request):
    if "spotify_token" not in request.session:
        return JsonResponse({"error": "User must be logged in to Spotify"}, status = 401)
    
    results = sp.current_user_top_tracks()
    songs = results['items']
    
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

@csrf_exempt
def getDiscoverSpotify(request):
    if request.method == 'GET':
        try:
            now = int(datetime.now().timestamp())

            # Check cache
            cached_data = cache.get("DISCOVER_SONGS")
            if cached_data:
                # cache.delete("DISCOVER_SONGS")
                discover_data = json.loads(cached_data)
                timestamp = discover_data.get("timestamp", 0)
                if now - timestamp < 86400:  # Cache valid for 24 hours
                    return JsonResponse(discover_data)

            # Fetch new releases from Spotify
            newReleases = sp.new_releases(limit=5)
            new_releases_data = [
                {
                    "trackID": song['id'],
                    "title": song['name'],
                    "artist": song['artists'][0]['name'],
                    "album": song.get('name', None),
                    "image": song['images'][0]['url'] if song.get('images') else None,
                    "uri": song['uri']
                }
                for song in newReleases['albums']['items']
            ]

            # Fetch Billboard data
            response = requests.get("https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main/recent.json")
            if response.status_code != 200:
                return JsonResponse({"error": "Failed to fetch Billboard data"}, status=500)
            
            billboard_data = response.json()
            cleanedBillboardData = [
                {
                    "song": song["song"],
                    "artist": song["artist"],
                    "this_week": song["this_week"],
                    "last_week": song.get("last_week"),
                    "peak_position": song.get("peak_position"),
                    "weeks_on_chart": song.get("weeks_on_chart"),
                }
                for song in billboard_data.get("data", [])
            ]

            # Check the first 5 songs from Billboard against Spotify API
            trending_data = []
            for song in cleanedBillboardData[:5]:
                query = f"{song['song']} {song['artist']}"
                results = sp.search(query, limit=1)
                if results['tracks']['items']:
                    track = results['tracks']['items'][0]
                    trending_data.append({
                        "trackID": track['id'],
                        "title": song['song'],
                        "artist": song['artist'],
                        "album": track['album']['name'],
                        "image": track['album']['images'][0]['url'] if track['album']['images'] else None,
                        "uri": track['uri']
                    })

            # Combine data and cache it
            discover_data = {
                "new": new_releases_data,
                "trending": trending_data,
                "timestamp": now
            }
            cache.set("DISCOVER_SONGS", json.dumps(discover_data), timeout=86400)

            return JsonResponse(discover_data, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)
