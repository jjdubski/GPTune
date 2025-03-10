import React, { useEffect, useState, useRef } from 'react';
import './PlaylistList.css';
import Playlist from '../Playlist/Playlist';

interface Playlist {
    playlistID: string;
    name: string;
    image: string;
}

interface PlaylistListProps {
    onSelectPlaylist: (playlistID: string) => void;
    selectedPlaylistID?: string;
    highlightSelected?: boolean;
}

    const PlaylistList: React.FC<PlaylistListProps> = ({ onSelectPlaylist, selectedPlaylistID, highlightSelected}) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const hasFetchedPlaylists = useRef(false);

    useEffect(() => {
        if (hasFetchedPlaylists.current) return;

        const fetchPlaylists = async () => {
            try {
                const response = await fetch('http://localhost:8000/playlistAPI/playlists/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlaylists(Array.isArray(data) ? data : []);
                hasFetchedPlaylists.current = true;

                setError(null);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Playlists:', error);
                setError('Failed to fetch Playlists. Please try again later.' + error);
            }
        };

        fetchPlaylists();
    }, []);

    return (
        isLoading ? (
            <>Loading Playlist...</>
        ) : (error ? (
            <p style={{ color: 'red' }}>{error}</p>
        ) : playlists.length === 0 ? (
            <p>No playlists available</p>
        ) : (
            <div className="playlist-list">
                {playlists
                    .sort((a, b) => (a.playlistID === 'liked_songs' ? -1 : b.playlistID === 'liked_songs' ? 1 : 0))
                    .map(playlist => (
                        <div
                            className={`${selectedPlaylistID === playlist.playlistID ? 'playlist-item playlist-item-selected' : 'playlist-item'}`}
                            key={playlist.playlistID}
                            onClick={() => onSelectPlaylist(playlist.playlistID)}
                        >
                            <Playlist
                                playlistID={playlist.playlistID}
                                title={playlist.name}
                                image={playlist.image}
                                selectedPlaylistID={selectedPlaylistID}
                            />
                        </div>
                    ))}
            </div>
        ))
    );
};

export default PlaylistList;