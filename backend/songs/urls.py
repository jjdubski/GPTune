from django.urls import path, include
from rest_framework import routers
from songs.views import SongViewSet, AddSongView 
from .views import AddSongs, playSong, getDiscoverSpotify

router = routers.DefaultRouter()
router.register(r'songs', SongViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('addSong/', AddSongView.as_view(), name='addSong'),
    path('addSongs/', AddSongs, name = "addSongs" ), 
    path('playSong/', playSong, name = "playSong"), 
    path('getDiscoverSpotify/', getDiscoverSpotify, name = "getDiscoverSpotify"),  
]