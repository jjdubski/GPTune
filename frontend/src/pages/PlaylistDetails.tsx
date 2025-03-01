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
    image: string;
}   

const PlaylistDetails: React.FC = () => {
    const { playlistID } = useParams<{ playlistID: string }>();
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/${playlistID}/`)
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
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching Playlist:', error);
                setError('Failed to fetch Playlist. Please try again later.' + error);
            });
    }, [playlistID]);

    return (
        isLoading ? (
            <></>
        ) :
        <>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : playlist.length === 0 ? (
                <p>No songs available</p>
            ) : (
                <div>
                    {playlist.map((song) => (
                        <div className="song-item" key={song.id}>
                            <Song title={song.title} artist={song.artist} album={song.album} image={song.image} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PlaylistDetails;