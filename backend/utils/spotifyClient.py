# backend/utils/spotify_client.py
import os
import json
import errno
import logging
from spotipy import Spotify, CacheHandler
from spotipy.oauth2 import SpotifyOAuth

# Set up custom cache handler
class CustomCacheHandler(CacheHandler):
    def __init__(self,
        cache_path=None,
        username=None,
        encoder_cls=None):
        self.encoder_cls = encoder_cls
        if cache_path:
            self.cache_path = cache_path
        else:
            cache_path = ".cache"
            if username:
                cache_path += "-" + str(username)
            self.cache_path = cache_path

    def get_cached_token(self):
        logger = logging.getLogger(__name__)
        
        token_info = None

        try:
            f = open(self.cache_path)
            token_info_string = f.read()
            f.close()
            token_info = json.loads(token_info_string)

        except OSError as error:
            if error.errno == errno.ENOENT:
                logger.debug("cache does not exist at: %s", self.cache_path)
            else:
                logger.warning("Couldn't read cache at: %s", self.cache_path)

        return token_info

    def save_token_to_cache(self, token_info):
        logger = logging.getLogger(__name__)
        try:
            f = open(self.cache_path, "w")
            f.write(json.dumps(token_info, cls=self.encoder_cls))
            f.close()
        except OSError:
            logger.warning('Couldn\'t write token to cache at: %s',
                        self.cache_path)

    def delete_cached_token(self):
        logger = logging.getLogger(__name__)
        try:
            os.remove(self.cache_path)
        except OSError:
            logger.warning('Couldn\'t delete cache at: %s', self.cache_path)

auth_manager = SpotifyOAuth(
    client_id=os.getenv("DJANGO_APP_SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("DJANGO_APP_SPOTIFY_SECRET"),
    redirect_uri="http://localhost:8000/callback",
    scope="user-library-read user-read-email user-top-read user-read-private user-follow-read playlist-read-private playlist-read-collaborative app-remote-control streaming user-read-currently-playing user-modify-playback-state user-read-playback-state playlist-modify-private playlist-modify-public user-library-modify",
    cache_handler=CustomCacheHandler()    
    # cache_handler=CustomCacheHandler(cache_path=".cache")
)
# token = auth_manager.get_access_token()
sp = Spotify(auth_manager=auth_manager)
