import logging
import os
import json
import spotipy
from django.http import HttpResponse, JsonResponse
from datetime import datetime
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from playlists.models import Playlist
from songs.models import Song
from spotipy import SpotifyOAuth
from utils.spotifyClient import sp
from utils.openai_client import client, prompt_for_song

logger = logging.getLogger(__name__)

unknown_songs = set()
song_cache = {}
top_ten_tracks = {}
top_ten_artists = {}
saved_tracks = {}
country = ""
# @csrf_exempt
# def recommend_songs(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body.decode("utf-8"))

#             # Safely get values, defaulting to empty list if missing
#             top_artists = data.get("top_artists", [])
#             top_genres = data.get("top_genres", [])

#             if not top_artists:
#                 return JsonResponse({"error": "Missing 'top_artists' field"}, status=400)

#             # Call OpenAI function
#             recommendations = openai_client.generate_recommendations({
#                 "top_artists": top_artists,
#                 "top_genres": top_genres
#             })
            
#             return JsonResponse({"recommendations": recommendations})
        
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON format"}, status=400)

#     return JsonResponse({"error": "Invalid request method"}, status=405)


def index(request):
    current_time = datetime.now().strftime("%H:%M:%S")
    current_date = datetime.now().strftime("%d-%m-%Y")
    currentUser = None
    profile_pic = '/spotify-logo.png'
    
    if sp.auth_manager.get_cached_token():
        currentUser = sp.current_user()
    else:
        currentUser = {'id': '', 'display_name': '', 'email': '', 'image': ''}

    if currentUser.get('images') and currentUser['images'][0]['url']:
        profile_pic = currentUser['images'][0].get('url', '/spotify-logo.png')
    
    data = {
    #   'response': prompt_for_song ('give me a random color',1),
        'current_time': current_time,
        'current_date': current_date,
        'user': { 
            'id': currentUser['id'],
            'display_name': currentUser['display_name'],
            'email': currentUser['email'],
            'image': profile_pic
        }
    }
    # print(profile_pic)
    # print(len(currentUser['images']))
    return JsonResponse(data)

@csrf_exempt
def getRecommendations(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            prompt = data.get("prompt", "")
            num_runs = data.get("num_runs", 5)
            user_info = get_user_info()
            response = run_prompt (prompt, num_runs, user_info)
            
            # Log the raw AI response
            logger.info(f"Raw OpenAI Response: {response}")
            songs = {}
            for trackID in response:
                trackInfo = sp.track(trackID)
                # print(trackInfo,"\n\n")
                songs[trackID] = {
                    "title": trackInfo['name'],
                    "artist": trackInfo['artists'][0]['name'],
                    "album": trackInfo['album']['name'],
                    "image": trackInfo['album']['images'][0]['url']

                }
            print (songs)
            # Return the processed AI response inside the original structure
            return JsonResponse({"response": response})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)





def generate_response(prompt, num_runs=10):
    # global response_index 
    # print(f"Response {response_index}: ")
    output = prompt_for_song(prompt, num_runs)
    # Clean the output by removing triple backticks and the json keyword
    # Parse the JSON string into a list of dictionaries
    output_list = process_json(output)
    track_ids = []
    ban_list = set()
    # print(output_list)
    while len(track_ids) < num_runs:
        for song in output_list:
            if len(track_ids) >= num_runs:
                break
            artist = song["artist"].strip()
            title = song["title"].strip()
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
                print(f"\t\tRe-prompting for song: ")
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
    return track_ids


def run_prompt(prompt, num_runs, user_info):
   
    top_ten_tracks = [track['name'] for track in user_info['top_ten_tracks']['items']]
    prompt += f"\nTop 10 Songs: {top_ten_tracks},"

    top_ten_artists = [artist['name'] for artist in user_info['top_ten_artists']['items']]
    prompt += f"\nTop 10 Artists: {top_ten_artists},"

    saved_tracks = [track['track']['name'] for track in user_info['saved_tracks']['items']]
    prompt += f"\nTop 50 Saved Songs: {saved_tracks},"

    prompt += f"\nCountry: {user_info ['country']},"

    return generate_response(prompt, num_runs)

def process_json(output):
    """Cleans and parses OpenAI's JSON response."""
    output = output.strip().strip("```json").strip("```").strip()
    try:
        return json.loads(output)
    except json.JSONDecodeError:
        print(f"Error parsing JSON response: {output}")
        return [{"title": "Unknown", "artist": "Unknown", "album": "Unknown"}]
    

def get_user_info():
    tokenInfo = sp.auth_manager.get_cached_token()
    if tokenInfo:
        user = sp.current_user()
        top_ten_tracks = sp.current_user_top_tracks(limit=10)
        top_ten_artists = sp.current_user_top_artists(limit=10)
        followed_artists = sp.current_user_followed_artists(limit=10)
        saved_albums = sp.current_user_saved_albums(limit=50)
        saved_tracks = sp.current_user_saved_tracks(limit=50)
        country = sp.current_user()['country']
        userInfo = {
            "user": user,
            "top_ten_tracks": top_ten_tracks,
            "top_ten_artists": top_ten_artists,
            "followed_artists": followed_artists,
            "saved_albums": saved_albums,
            "saved_tracks": saved_tracks,
            "country": country
        }
        # print(userInfo) # Debug
        return userInfo
    else:
        return None
    
# Function to validate Song 
def check_song_exists(title, artist, verbose=True):
    if f"{title}-{artist}" in unknown_songs:
        if(verbose):
            print(f"\t\tUnknown track, skipping.")
        return None
    search_result = sp.search(q=f'artist:{artist} track:{title}', type='track')
    if search_result['tracks']['items']:
        track_id = search_result['tracks']['items'][0]['id']
        song_cache[track_id] = search_result['tracks']['items'][0]
        if(verbose):
            print(f"\t\tTrack ID: {track_id}")
        return track_id
    else:
        if(verbose):
            print(f"\t\tTrack not found")
            unknown_songs.add(f"{title}-{artist}")
        return None

# find new song is song doesnt exist
def find_new_song(title, artist, tracks=[]):
    print(f"\tSearching track ID for: {title} by {artist}")
    track_id = check_song_exists(title, artist)
    if track_id in tracks:
            print(f"\t\tTrack already recommended, skipping.")
            track_id = None
    return track_id


#function to return list of songs

def login(request):
    # Redirect user to Spotify authorization URL
    auth_url = sp.auth_manager.get_authorize_url()
    return redirect(auth_url)

def logout(request):
    request.session.flush()
    # log user out of Spotify
    sp.auth_manager.cache_handler.delete_cached_token()
    #cleanup database
    Song.objects.all().delete()
    Playlist.objects.all().delete()

    return redirect('http://localhost:3000/')

def callback(request):
    logger = logging.getLogger(__name__)
    try:
        code = request.GET.get("code")
        logger.info(f"Authorization code received: {code}")

        if code:
            try:
                token_info = sp.auth_manager.get_access_token(code)
                logger.info(f"Token info received: {token_info}")
                if token_info:
                    # Save token info to session
                    request.session["token_info"] = token_info
                    populatePlaylist()
                    populateSongs()
                    getLikedSongs()
                    return redirect("http://localhost:3000/")
                    # return HttpResponse("Authentication successful")
                else:
                    logger.error("Failed to retrieve access token")
                    return HttpResponse("Failed to retrieve access token", status=500)
            except spotipy.SpotifyException as e:
                logger.error(f"Spotify API error: {str(e)}")
                return HttpResponse(f"Spotify API error: {str(e)}", status=500)
            except Exception as e:
                logger.error(f"Error in callback: {str(e)}")
                return HttpResponse(f"Failed to retrieve access token: {str(e)}", status=500)
        else:
            logger.error("No code provided")
            return HttpResponse("No code provided", status=400)
    except Exception as e:
        logger.error(f"Error in callback: {str(e)}")
        return JsonResponse({"error": "Authentication failed"}, status=500)

def populateSongs():
    try:
        results = sp.current_user_top_tracks()
        songs = results['items']

        for song in songs:
            if not Song.objects.filter(trackID=song['id']).exists():
                release_date = datetime.strptime(song['album']['release_date'], '%Y-%m-%d').date()
                Song.objects.create(
                    trackID=song['id'],
                    title=song['name'],
                    artist=song['artists'][0]['name'],
                    album=song['album']['name'],
                    release_date=release_date,
                    genre=", ".join(song.get('genres', [])),
                    image=song['album']['images'][0]['url'] if song['album']['images'] else None
                )
        return True
    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Error populating songs: {str(e)}")
        return False
    
def populatePlaylist():
    try:
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
                logger = logging.getLogger(__name__)
                logger.info(playlist['images'][0]['url'])
        return True
    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Error populating Playlist: {str(e)}")
        return False

def getToken(request):
    tokenInfo = sp.auth_manager.get_cached_token()
    if tokenInfo:
        return JsonResponse(tokenInfo)
    else:
        return JsonResponse({"error": "No token found"}, status=404)

    

def getUser(request):
    tokenInfo = sp.auth_manager.get_cached_token()
    if tokenInfo:
        user = sp.current_user()
        # print(user)
        return JsonResponse(user)
    else:
        return JsonResponse({"error": "No token found"}, status=404)

def getLikedSongs():
    # if "spotify_token" not in request.session:
    #     return JsonResponse({"error": "User must be logged in to Spotify"}, status=401)
    
    raw_liked_songs = []
    liked_songs = []
    limit = 100 # you can change this to any number
    offset = 0
    try:
        while limit > 0:
            fetch_limit = min(limit, 50)
            results = sp.current_user_saved_tracks(limit=fetch_limit, offset=offset)
            raw_liked_songs.extend(results['items'])
            offset += fetch_limit
            limit -= fetch_limit
            if len(results['items']) < fetch_limit:
                break
    except Exception as e:
        return JsonResponse({"error": f"Failed to get saved songs: {str(e)}"}, status=500)
    
    for song in raw_liked_songs:
        release_date = song['track']['album']['release_date']
        if release_date:
            release_date_parts = release_date.split('-')
            if len(release_date_parts) == 3:
                release_date = f"{release_date_parts[0]}-{release_date_parts[1]}-{release_date_parts[2]}"
            elif len(release_date_parts) ==  1:
                release_date = f"{release_date_parts[0]}-01-01"
            else:
                release_date = None

        track = song['track']
        track_id = track['id']
        track_name = track['name']
        album_data = track['album']
        # album_id = album_data['id']
        album_name = album_data['name']
        artist_data = track['artists'][0]
        # artist_id = artist_data['id']
        artist_name = artist_data['name']

        # Check if the song already exists
        if not Song.objects.filter(trackID=track_id).exists():
            # Create a new song
            song = Song.objects.create(
                trackID=track_id,
                title=track_name,
                artist=artist_name,
                album=album_name,
                release_date=release_date,
                genre=", ".join(album_data.get('genres', [])),
                image=album_data['images'][0]['url'] if album_data['images'] else ''
            )
            liked_songs.append(song)
        else:
            # If the song already exists, retrieve it
            song = Song.objects.get(trackID=track_id)
            liked_songs.append(song)

    # Create or update the playlist
    # Check if the playlist already exists
    if Playlist.objects.filter(playlistID="liked_songs").exists():
        playlist = Playlist.objects.get(playlistID="liked_songs")
    else:
        # Create a new playlist
        playlist = Playlist.objects.create(
            playlistID="liked_songs",
            name="Liked Songs",
            description="Your saved songs from Spotify",
            image="https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8470d229cb865e8d81cdce0889",
        )

    if liked_songs:
        playlist.songs.set(liked_songs)
        playlist.save()
    
    return JsonResponse({"message": "Saved songs imported successfully"}, status=201)