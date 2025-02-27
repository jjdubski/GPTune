from django.db import models
from songs.models import Song

# Create your models here.
class Playlist(models.Model):
    playlistID = models.CharField(max_length=100, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    coverArt = models.URLField(null=True, blank=True)
    songs = models.ManyToManyField(Song, related_name="playlists" )
    createdAt = models.DateTimeField(auto_now_add=True)
    updateAt = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
