# Generated by Django 5.1.6 on 2025-02-26 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playlists', '0002_remove_playlist_discription_playlist_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlist',
            name='playlistID',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
