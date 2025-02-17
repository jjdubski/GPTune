from django.urls import path, include
from rest_framework import routers
from songs.views import SongViewSet
from .views import getSong

router = routers.DefaultRouter()
router.register(r'songs', SongViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('getSongs', getSong, name='getSong')
]