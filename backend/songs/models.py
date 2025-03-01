from django.db import models

# Create your models here.
class Song(models.Model):
    trackID = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    album = models.CharField(max_length=100)
    release_date = models.DateField(blank=True, null=True)
    genre = models.CharField(max_length=50)
    image = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"