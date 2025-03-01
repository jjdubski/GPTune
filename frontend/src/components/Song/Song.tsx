import React, { useEffect, useState } from 'react';
import './Song.css';

interface SongProps {
    title: string;
    artist: string;
    album: string;
    image : string;
}

const Song: React.FC<SongProps> = ({title, artist, album, image}) => {
    return (
        <div className='song'>
            <img className="song-image" src={image} alt={`${title} album cover`} />
            <div className='song-info'>
                <p className='song-title'>{title}</p>
                <p className='song-artist'>{artist}</p>
                <p className='song-album'>{album}</p>
            </div>
        </div>
    );
};

const Songs = ({ onPlaySong, playlistID }) => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        if (!playlistID) return; // Prevent fetch if no playlistID is provided

        fetch(`http://localhost:8000/getPlaylistSongs/${playlistID}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                setSongs(data);
            })
            .catch(error => {
                console.error('Error fetching songs:', error);
                setSongs([]);
            });
    }, [playlistID]); // Re-fetch when playlistID changes

    return (
        <div>
            <h2>Playlist Songs</h2>
            <ul>
                {songs.map((song, index) => (
                    <li key={index} onClick={() => onPlaySong(song)}>
                        {song.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Songs;