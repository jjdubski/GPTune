from django.urls import path, include
from rest_framework import routers
from songs.views import SongViewSet, AddSongView
from .views import getSong,AddSongs

router = routers.DefaultRouter()
router.register(r'songs', SongViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('addSong/', AddSongView.as_view(), name='addSong'),
    path('addSongs/', AddSongs, name = "addSongs" )    
]