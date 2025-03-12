import React, { useState, useEffect } from 'react';
import './LikedSongList.css';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    uri: string;
}





const LikedSongList: React.FC = () => {
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const response = await fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/liked_songs`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLikedSongs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching liked songs:', error);
            }
        };

        fetchLikedSongs();
    }, []);
    console.log(likedSongs)
    return (
        <div className="liked-songs-container">
            <h1 className="liked-songs-title">Liked Songs</h1>
            <div className="liked-songs-list scroll">
                {likedSongs.length > 0 ? (
                    likedSongs.map((song) => (
                        <div key={song.trackID} className="liked-song-item">
                            <img src={song.image} alt={song.title} className="liked-song-image" />
                            <div className="liked-song-info">
                                <p className="liked-song-title">{song.title}</p>
                                <p className="liked-song-artist">{song.artist}</p>
                                <p className="liked-song-album">{song.album}</p>
                            </div>
                            <button className="remove-song-btn">
                                <img src="/remove-song-btn.png" alt="Remove" className="remove-icon" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No liked songs found.</p>
                )}
            </div>
        </div>
    );
};

export default LikedSongList;
