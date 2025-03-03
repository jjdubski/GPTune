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
            uri = data.get('uri',"").strip().split(',')
            #uri = ["spotify:track:4DRVBIISdoxJAb7Syh3gSt"]
            # https://open.spotify.com/track/1n9gX9HJTDeCLRCFt2M5Ca?si=364a446db318456c
            # spotify:track:1n9gX9HJTDeCLRCFt2M5Ca
            print(uri)
            
            if not uri:
                return JsonResponse({"error":"Missing URI"}, status = 400)
            
            sp.start_playback(uris=uri)
            
            return JsonResponse({"message": "Song is playing"}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)           
            
        
        
        
    #     return JsonResponse({"message": "Song is playing"}, status=200)
    # else:
    #     return JsonResponse({"error": "Invalid request"}, status=400)
    
        
            