import React, { useState, useEffect } from 'react';
import SongSelector from '../components/SongSelector/SongSelector';
import SongCard from '../components/SongCard/SongCard';
import './ThisorThat.css';
import LikedSongList from '../components/LikedSongList/LikedSongList';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    uri: string;
}

const ThisorThat: React.FC = () => {
    const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
    const [selectedPlaylistID, setSelectedPlaylistID] = useState<string | null>("liked_songs");
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasFetchedSongs = React.useRef(false);

    useEffect(() => {

        const fetchPlaylists = async () => {
            if (!selectedPlaylistID) {
                return;
            }
            try {
                const response = await fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/${selectedPlaylistID}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlaylistSongs(Array.isArray(data) ? data : []);
                setCurrentIndex(0);
            } catch (error) {
                console.error('Error fetching Playlist songs:', error);
            }
            hasFetchedSongs.current = false;
        };

        fetchPlaylists();
    }, [selectedPlaylistID]);

    const handleSelectPlaylist = (playlistID: string) => {
        setPlaylistSongs([]);
        setSelectedPlaylistID(playlistID);
        setCurrentIndex(0);
    };
    const handleNextSong = async () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % playlistSongs.length);

        try {
            const response = await fetch('http://localhost:8000/playlistAPI/generateSong/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: `give me one more song similar to ${playlistSongs.map(song => song.title).join(", ")}`,
                    num_runs: 1
                })
            });

            const data = await response.json();
            if (response.ok) {
                const newSong: Song = {
                    trackID: data.trackID,
                    title: data.title,
                    artist: data.artist,
                    album: data.album,
                    image: data.image,
                    uri: data.uri
                };
                setPlaylistSongs((prevSongs) => [...prevSongs, newSong]);
            } else {
                console.error('Error:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePrevSong = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + playlistSongs.length) % playlistSongs.length);
    };


    return (
        <div className="this-or-that-page">
            <div className="this-or-that-container">
                <div className="this-or-that-content">
                    <h1>Showing Songs Like</h1>
                    <SongSelector
                        title={playlistSongs[currentIndex]?.title || "No Songs"}
                        artist={playlistSongs[currentIndex]?.artist || ""}
                        image={playlistSongs[currentIndex]?.image || ""}
                        spotifyUrl={playlistSongs[currentIndex]?.uri || ""}
                        songs={playlistSongs} />

                    {playlistSongs.length > 0 && (
                        <>
                            <SongCard
                                trackID={playlistSongs[currentIndex].trackID}
                                title={playlistSongs[currentIndex].title}
                                artist={playlistSongs[currentIndex].artist}
                                album={playlistSongs[currentIndex].album}
                                image={playlistSongs[currentIndex].image}
                                uri={playlistSongs[currentIndex].uri}
                            />

                            <div className="action-buttons">
                                <button className="exit-btn" onClick={handlePrevSong}>
                                    <img src="/exit.png" alt="Exit" />
                                </button>
                                <button className="check-btn" onClick={handleNextSong}>
                                    <img src="/check.png" alt="Check" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Liked Songs on the Right Side */}
            <div className="liked-songs-sidebar">
                <LikedSongList/>
            </div>
        </div>
    );
};

export default ThisorThat;
