from rest_framework import serializers
from .models import Playlist
from songs.serializers import SongSerializer

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    
    class Meta:
        model = Playlist
        fields = ['id','playlistID', 'name', 'description', 'coverArt', 'songs']