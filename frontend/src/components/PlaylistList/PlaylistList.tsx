import React, { useEffect, useState } from 'react';
import './PlaylistList.css';
import Playlist from '../Playlist/Playlist';

interface Playlist {
    playlistID: string;
    name: string;
    image: string;
}

interface PlaylistListProps {
    onSelectPlaylist: (playlist: Playlist) => void;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ onSelectPlaylist }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/playlistAPI/playlists/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                setPlaylists(Array.isArray(data) ? data : []);
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching Playlists:', error);
                setError('Failed to fetch Playlists. Please try again later.' + error);
            });
    }, []);

    return (
        <>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : playlists.length === 0 ? (
                <p>No playlists available</p>
            ) : (
                <div className="playlist-list">
                    {playlists.map(playlist => (
                        <div className='playlist-container' key={playlist.id} onClick={() => onSelectPlaylist(playlist)}>
                            <Playlist
                                playlistID={playlist.playlistID}
                                title={playlist.name}
                                image={playlist.image}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PlaylistList;

