import React, { useEffect, useState } from 'react'
import Playlist from '../components/Playlist/Playlist'
import './Playlist.css'
import PlaylistList from '../components/PlaylistList/PlaylistList'
import RefreshButton from '../components/RefreshIcon/RefreshIcon'
interface Playlist {
    id: number;
    name: string;
    description: string;
    coverArt: string;
}

const Playlists: React.FC = () => {
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

    //function written using above as template
    const fetchPlaylists = () => {
        fetch('http://localhost:8000/playlistAPI/playlists/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                if (data.playlists && Array.isArray(data.playlists)) {
                    setPlaylists(data.playlists);
                } else {
                    setPlaylists(Array.isArray(data) ? data : []);
                }
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching Playlists:', error);
                setError('Failed to fetch Playlists. Please try again later. ' + error);
            });
    };

    // Function to handle refresh button click
    const handleRefresh = () => {
        fetchPlaylists(); // Re-fetch playlists when clicked
    };

    return (
        <div>
                        {/* Refresh Button Container */}
            <div className="refresh-button-container">
                <RefreshButton onRefresh={handleRefresh} />
            </div>
            

            <h2>Your Spotify Playlists</h2>
            
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : playlists.length === 0 ? (
                <p>No playlists available</p>
            ) : (
                <div className="playlists-grid">
                    {playlists.map(playlist => (
                        <Playlist
                            key={playlist.id}
                            id = {playlist.id}
                            title={playlist.name}
                            image={playlist.coverArt}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Playlists