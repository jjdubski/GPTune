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

interface LikedSongListProps {
    songs: Song[];
}

const LikedSongList: React.FC<LikedSongListProps> = ({ songs }) => {
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [songList, setSongList] = useState<Song[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const onClose = () => {
        setIsOpen(false);
    };

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

    // useEffect(() => {
    //     const removeSong = async () => {
    //         try{
    //             const response = await fetch('http://localhost:8000/playlistAPI/removeSong', {
    //                 method : 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
    //                     playlistID: 'liked_songs',
    //                     trackID: selectedTrackID,
    //                 }),
    //             });
    //             if(response.ok){
    //                 console.log('Song removed successfully, trackID:', selectedTrackID);
    //             } else {
    //                 console.error('Failed to remove song:', response);
    //             }
    //         } catch (error) {
    //             console.error('Error removing song:', error);
    //         }
            
    //     };

    //     removeSong();
    // }, [selectedTrackID]);

    const handleRemoveSong = async (trackID: string) => {
        try{
            const response = await fetch('http://localhost:8000/playlistAPI/removeSong/', {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playlistID: 'liked_songs',
                    trackID: trackID,
                }),
            });
            if(response.ok){
                console.log('Song removed successfully, trackID:', trackID);
            } else {
                console.error('Failed to remove song:', response);
            }
        } catch (error) {
            console.error('Error removing song:', error);
        }
        setSongList((prevSongs) => prevSongs.filter((song) => song.trackID !== trackID));
    };

    useEffect(() => {
        if (songs && songs.length > 0) {
            setSongList(songs);
        } else {
            setSongList(likedSongs);
        }
    }, [songs, likedSongs]);

    return (
        
  <div className="liked-songs-container" style={{ display: isOpen ? 'inline-block' : 'none' }}>
            {/* Close Button */}
        <button className="close-liked-songs" onClick={onClose}>X</button>
        <h1 className="liked-songs-title">Liked Songs</h1>
            <div className="liked-songs-list scroll">
                {songList.length > 0 ? (
                    songList.map((song) => (
                        <div key={song.trackID} className="liked-song-item">
                            <img src={song.image} alt={song.title} className="liked-song-image" />
                            <div className="liked-song-info">
                                <p className="liked-song-title">{song.title}</p>
                                <p className="liked-song-artist">{song.artist}</p>
                                <p className="liked-song-album">{song.album}</p>
                            </div>
                            <button className="remove-song-btn" onClick={async () => { await handleRemoveSong(song.trackID); }} >
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
