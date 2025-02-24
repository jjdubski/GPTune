"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from .views import index, login, callback, logout, getToken
from backend.views import chat_with_ai


urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('', index, name='index'), # Default view
    path("login/", login, name='login'),
    path("callback/", callback, name='callback'),
    path('songAPI/', include('songs.urls'), name='songAPI'),
    path('logout/', logout, name='logout'),
    path("chat/", chat_with_ai, name="chat_with_ai"),
    path('playlistAPI/', include('playlists.urls'), name='playlistAPI'),
    path('getToken/', getToken, name='getToken')
     
]

# if settings.DEBUG:
#     urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
