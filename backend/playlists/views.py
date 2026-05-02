import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Playlist
from .models import Song
from .serializers import PlaylistSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.spotifyClient import sp
from django.views.decorators.csrf import csrf_exempt
from utils.openai_client import prompt_for_song
import logging
from backend.views import process_json, find_new_song, unknown_songs

# Create your views here
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
                image=playlist['images'][0]['url'] if playlist['images'] else None
            )
            # logger = logging.getLogger(__name__)
            # logger.info(playlist['images'][0]['url'])
            
    
    return Response({"message":"Playlist imported successfully"}, status= 201)

@api_view(['GET'])  
def getPlaylistSongs(request, playlist_id):
    # print(playlist_id)
    try:
        if playlist_id == "liked_songs":
            liked_songs = Playlist.objects.get(playlistID=playlist_id)
            songs = liked_songs.songs.all()

            songList = []
            for song in songs:
                songList.append({
                    'trackID': song.trackID,
                    'title': song.title,
                    'artist': song.artist,
                    'album': song.album,
                    'image': song.image,
                    'uri': song.uri
                })
        else:
            results = sp.playlist_items(playlist_id)
            songs = results['items']
        
            songList = []
            for song in songs:
                track = song['track']
                songList.append({
                    'trackID': track['id'],
                    'title': track['name'],
                    'artist': track['artists'][0]['name'],
                    'album': track['album']['name'],
                    'image': track['album']['images'][0]['url'] if track['album']['images'] else None,
                    'uri' : track['uri']
                })
        return JsonResponse(songList, safe=False)
    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Error populating songs: {str(e)}")
        return JsonResponse({"error": "Failed to get songs"}, status=500)

@api_view(['POST'])  
def addSongToPlaylist(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
    print(f"Request received: {request}")  # Log the entire request object
    
    try:
        # Parse the request body (the JSON data sent by the client)
        data = json.loads(request.body)
        print(f"Request Body: {data}")  # Log the parsed request body
        
        # Extract playlist ID and track URI from the parsed data
        playlist_id = data['playlistID']
        track_id = data['trackID']

        print(f"Playlist ID: {playlist_id}")
        print(f"Track ID: {track_id}")
        
        # Check if either playlist_id or track_uri is missing
        if not playlist_id or not track_id:
            return JsonResponse({'error': 'Missing playlistID or song URI'}, status=400)
        if(playlist_id == "liked_songs"):
            Playlist.objects.get(playlistID="liked_songs").songs.add(Song.objects.get(trackID=track_id))
            sp.current_user_saved_tracks_add(tracks=[track_id])
        else:
            Playlist.objects.get(playlistID=playlist_id).songs.add(Song.objects.get(trackID=track_id))
            sp.playlist_add_items(playlist_id, [track_id])

        return JsonResponse({'message': 'Song added successfully'}, status=200)
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except KeyError as e:
        return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f"Failed to add song: {str(e)}"}, status=500)
    
@api_view(['POST'])
def removeSong(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
    print(f"Request received: {request}")  # Log the entire request object
    
    try:
        data = json.loads(request.body)
        print(f"Request Body: {data}")  # Log the parsed request body
        
        playlist_id = data['playlistID']
        track_id = data['trackID']
        
        print(f"Playlist ID: {playlist_id}")
        print(f"Track ID: {track_id}")
        
        if not playlist_id or not track_id:
            return JsonResponse({'error': 'Missing playlistID or song URI'}, status=400)
        if(playlist_id == "liked_songs"):
            Playlist.objects.get(playlistID="liked_songs").songs.remove(Song.objects.get(trackID=track_id))
            sp.current_user_saved_tracks_delete(tracks=[track_id])
        else:
            Playlist.objects.get(playlistID=playlist_id).songs.remove(Song.objects.get(trackID=track_id))
            sp.playlist_remove_all_occurrences_of_items(playlist_id, [track_id])
        
        return JsonResponse({'message': 'Song removed successfully'}, status=200)
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except KeyError as e:
        return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': f"Failed to remove song: {str(e)}"}, status=500)
    
def generate_response(prompt, num_runs=1, songsInPlaylist=[]):
    # global response_index 
    # print(f"Response {response_index}: ")
    output = prompt_for_song(prompt, num_runs)
    # Clean the output by removing triple backticks and the json keyword
    # Parse the JSON string into a list of dictionaries
    output_list = process_json(output)
    print(f"Output: {output_list}")
    track_ids = []
    ban_list = set()
    # print(output_list)
    while len(track_ids) < num_runs:
        if len(track_ids) >= num_runs:
            break
        artist = output_list["artist"].strip()
        title = output_list["title"].strip()
        # Determine if song is valid and return track ID
        track_id = find_new_song(title, artist, track_ids)
        if track_id:
            ban_list.add(title+"-"+artist)
        else:
            unknown_songs.add(title+"-"+artist)
        # print(ban_list) # Debug
        while not track_id:
            # add ban list to end of prompt
            # if unknown_songs gets too large reset it
            if len(unknown_songs) > 50:
                unknown_songs.clear()
            if len(ban_list) > 30:
                ban_list.clear()
            prompt += f"\n\nThe following songs are already in the list or do not exist: {ban_list}, {unknown_songs}. Do not recommend them."
            # print(f"\t\tRe-prompting for song: ")
            track = prompt_for_song(prompt, 1)
            track_info = process_json(track)
            try:
                track_title = track_info['title']
                track_artist = track_info['artist']
            except:
                print(f"Error parsing track info: {track_info}")
                continue
            track_id = find_new_song(track_title, track_artist, track_ids)
            if track_id:
                ban_list.add(track_title+"-"+track_artist)
            else:
                unknown_songs.add(track_title+"-"+track_artist)
        track_ids.append(track_id)
        # response_index += 1
    # return track_ids
    rawSong= sp.track(track_id)
    image = rawSong['album']['images'][0]['url'] if rawSong['album']['images'] else None
    title = rawSong['name']
    artist = rawSong['artists'][0]['name']
    album = rawSong['album']['name']
    uri = rawSong['uri']
    newSong = {
        "trackID": track_id,
        "title": title,
        "artist": artist,
        "album": album,
        "image": image,
        "uri": uri
    }
    return newSong

@csrf_exempt
def generateSong(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    try:
        data = json.loads(request.body)
        prompt = data.get('prompt', '')
        num_runs = data.get('num_runs', 1)
        songsInPlaylist = data.get('songsInPlaylist', [])

        if not prompt:
            return JsonResponse({'error': 'Missing prompt'}, status=400)

        print(f"Prompt: {prompt}")
        response = generate_response(prompt, num_runs, songsInPlaylist)
        return JsonResponse(response, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f"Failed to generate song: {str(e)}"}, status=500)

def thisOrThat(request):
    likedSongs = Playlist.objects.get(playlistID="liked_songs")
    #playlists = Playlist.objects.all()#might need later
    likedSongsList = list(likedSongs.songs.values())
    
    songlist = []
    
    for i in range(len(likedSongsList)):
        artist = likedSongsList[i]['artist']
        title = likedSongsList[i]['title']
        
        songlist.append(f"{title} by {artist}")
    
    gptRecomendations = {}
    print(songlist)
    while not gptRecomendations:
        try:
            gptRecomendations = generate_response(songlist,1)#change to whatever the current selected playlist is
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": "Failed to generate song recommendations"}, status=500)
    print(gptRecomendations)
    #playlists_list = list(playlists.values())
    
    return JsonResponse({"gptRecomendations" : gptRecomendations}, status=200)
