import React, { useEffect, useState } from 'react'
import './PlaylistList.css'
import Playlist  from '../Playlist/Playlist'


const PlaylistList: React.FC = () => {
    interface Playlist {
        id: number;
        title: string;
        img: string;
    }
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Updated endpoint URL to match backend route
        fetch('http://localhost:8000/playlistAPI/playlists/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json()
            })
            .then(data => {
                console.log('Data received:', data)
                // Check if data.playlists exists and is an array
                if (data.playlists && Array.isArray(data.playlists)) {
                    setPlaylists(data.playlists)
                } else {
                    // If the response format is different, try to use the data directly
                    setPlaylists(Array.isArray(data) ? data : [])
                }
                setError(null)
            })
            .catch(error => {
                console.error('Error fetching Playlists:', error)
                setError('Failed to fetch Playlists. Please try again later.' + error)
            })
    }, [])
    
    return (
        <div>
            {error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : playlists.length === 0 ? (
                    <p>No playlists available</p>
                ) : (
                    <div className="playlists-grid">
                        {playlists.map(playlist => (
                            <Playlist
                                key={playlist.id}
                                title={playlist.name}
                                img={playlist.coverArt}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
};

export default PlaylistList;

