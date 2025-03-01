import React, { useEffect, useState } from 'react'
import './SongList.css'
import Song  from '../Song/Song'


interface Song {
    id: number;
    trackID: string;
    title: string;
    artist: string;
    album: string;
    releaseDate: string;
    coverArt: string;
}

interface SongListProps {
    playlistID?: string;
}

const SongList: React.FC = () => {

    const [songs, setSongs] = useState<Song[]>([])  
    const [error, setError] = useState<string | null>(null)

        useEffect(() => {
            const url = playlistID ? `http://localhost:8000/playlistAPI/getPlaylistSongs/${playlistID}/` 
            : 'http://localhost:8000/songAPI/songs/?format=json';

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()
                })
                .then(data => {
                    console.log('Data received:', data)
                    setSongs(data)
                    setError(null)
                })
                .catch(error => {
                    console.error('Error fetching Songs:', error)
                    setError('Failed to fetch Songs. Please try again later.' + error)
                })
        }, [playlistID])
    
    return (
        <div>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : songs.length === 0 ? (
                <p>No Songs available</p>
            ) : (
                <PlaylistSongList playlist={songs} />
            )}
        </div>
    );
};

const PlaylistSongList: React.FC<{ playlist: Song[] }> = ({ playlist }) => {
    return (
        <div>
        {playlist.map((song) => (
            <div className="song" key={song.id}>
                <Song title={song.title} artist={song.artist} album={song.album} img={song.coverArt} />
            </div>
        ))}
    </div>
    );
};


export default SongList;

