import React, { useState, useEffect } from 'react';
import './AddToPlaylist.css';
import User from '../components/User/User';
import Playlist from '../components/Playlist/Playlist';
import SongList from '../components/SongList/SongList';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import RecomendedSongList from '../components/RecomendedSongList/RecomendedSongList';

interface Playlist {
    id: number;
    name: string;
    coverArt: string;
}

const AddToPlaylist: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
const [currentUser, setCurrentUser] = useState({
    email: '',
    username: '',
    image: '/spotify-logo.png'
});
const [isLoading, setIsLoading] = useState(true);
const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000').then(res => res.json()).then(data => {
            setCurrentUser({
                email: data.user.email || '',
                username: data.user.display_name || '',
                image: data.user.image || '/spotify-logo.png'
            });
            console.log(data);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch('http://localhost:8000/playlistAPI/playlists/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlaylists(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setError('Failed to fetch playlists. Please try again later.');
            }
        };

        fetchPlaylists();
    }, []);

    const handlePlaylistClick = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
    };

    return (
        <div className="add-to-playlist-container">
            <div className="playlist-container">
                {currentUser.email ? (
                    <User username={currentUser.username} image={currentUser.image} />
                ) : (
                    <div className="spotify-button-container">
                        <SpotifyButton 
                            title="Link Spotify"
                            img="./SpotifyButton.png"
                        />
                    </div>
                )}

                <h2 className="playlist-title">PLAYLISTS</h2>

                <div className="playlist-scroll">
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <div key={playlist.id} className="playlist-item" onClick={() => handlePlaylistClick(playlist)}>
                                <img src={playlist.coverArt} alt={playlist.name} className="playlist-image" />
                                <p className="playlist-name">{playlist.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-playlists">No playlists available</p>
                    )}
                </div>
            </div>

            <div className="recommended-songs-container">
                <h2 className="recommended-songs-title">Recommended Songs</h2>
                <div className="song-scroll">
                    {selectedPlaylist ? (
                        <RecomendedSongList playlist={selectedPlaylist} />
                    ) : (
                        <p>Select a playlist to see recommended songs</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylist;
