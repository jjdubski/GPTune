from urllib import response
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets, generics
from songs.models import Song
from songs.serializers import SongSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view


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
    
    songList = []
    
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
                    coverArt = song['album']['images'][0]['url'] if song['album']['images'] else None
                )
    return Response({"message": "Data successfully added!"}, status=201)

