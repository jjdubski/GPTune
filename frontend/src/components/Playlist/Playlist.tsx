import React, { useEffect, useState } from 'react';
import './Playlist.css';
import Song from '../Song/Song';

interface Song {
    id: number;
    trackID: string;
    title: string;
    artist: string;
    album: string;
    releaseDate: string;
}

const Playlist: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/songAPI/playlist/?format=json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Playlist data received:', data);
                setSongs(data);
            })
            .catch(error => console.error('Error fetching playlist:', error));
    }, []);

    return (
        <div className="playlist">
            <h2>My Playlist</h2>
            {songs.length > 0 ? (
                songs.map(song => (
                    <div key={song.id} className="playlist-item">
                        <Song 
                            title={song.title} 
                            artist={song.artist} 
                        />
                    </div>
                ))
            ) : (
                <p>No songs in the playlist.</p>
            )}
        </div>
    );
};

export default Playlist;
