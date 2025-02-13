from django.urls import path, include
from rest_framework import routers
from songs.views import SongViewSet

router = routers.DefaultRouter()
router.register(r'songs', SongViewSet)

urlpatterns = [
    path('', include(router.urls)),
]