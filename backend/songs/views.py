from django.shortcuts import render
from rest_framework import viewsets
from songs.models import Song
from songs.serializers import SongSerializer

# Create your views here.
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer