import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Song from '../components/Song/Song';


interface Song {
    id: number;
    trackID: string;
    title: string;
    artist: string;
    album: string;
    releaseDate: string;
    coverArt: string;
}   

const PlaylistDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/${id}/`)
            .then(response => {
                console.log(response);
                if (!response) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                if (data.songs && Array.isArray(data.songs)) {
                    setPlaylist(data.songs);
                } else {
                    setPlaylist(Array.isArray(data) ? data : []);
                }
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching Playlist:', error);
                setError('Failed to fetch Playlist. Please try again later.' + error);
            });
    }, [id]);

    return (
        <>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : playlist.length === 0 ? (
                <p>No songs available</p>
            ) : (
                <div>
                    {playlist.map((song) => (
                        <div className="song" key={song.id}>
                            <Song title={song.title} artist={song.artist} album={song.album} img={song.img} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PlaylistDetails;