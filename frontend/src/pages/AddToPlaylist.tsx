import React, { useState, useEffect } from 'react';
import './AddToPlaylist.css';
import User from '../components/User/User'; // Ensure this path is correct
import Playlist from '../components/Playlist/Playlist'; // Ensure this path is correct
import SongList from '../components/SongList/SongList'; // Ensure this path is correct

interface Playlist {
    id: number;
    name: string;
    coverArt: string;
}

const AddToPlaylist: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="add-to-playlist-container">
            <div className="playlist-container">
                <User username="John Doe" image="/path/to/user/image.jpg" /> {/* Adjust props as necessary */}

                <h2 className="playlist-title">PLAYLISTS</h2>

                <div className="playlist-scroll">
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <div key={playlist.id} className="playlist-item">
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
                    <SongList />
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylist;
