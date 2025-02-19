from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'playlists', views.PlaylistViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('getPlaylists/', views.getPlaylists, name='getPlaylists'),
]