import React, { useState, useEffect } from 'react';
import Artist from '../components/Artist/Artist';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SongList from '../components/SongList/SongList';
import User from '../components/User/User';
import RefreshButton from '../components/RefreshIcon/RefreshIcon'; // For refreshing songs
import './Search.css';

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>(''); // User search prompt
    const [songs, setSongs] = useState<any[]>([]); // List of recommended songs
    const [artists, setArtists] = useState<any[]>([]); // List of suggested artists
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSongsAndArtists();
    }, []);

    const fetchSongsAndArtists = () => {
        fetch(`http://localhost:8000/musicAPI/search?query=${query}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Data received:', data);
                if (data.songs && Array.isArray(data.songs)) {
                    setSongs(data.songs);
                } else {
                    setSongs([]);
                }
                if (data.artists && Array.isArray(data.artists)) {
                    setArtists(data.artists);
                } else {
                    setArtists([]);
                }
                setError(null);
            })
            .catch((error) => {
                console.error('Error fetching music data:', error);
                setError('Failed to fetch music data. Please try again later.');
            });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        fetchSongsAndArtists();
    };

    return (
        <div className="search-page">
            {/* Top Bar - User and Spotify Button */}
            <div className="top-bar">
                <User username="exampleUser" image="exampleImage.png" />
                <SpotifyButton title="Link Spotify" img="/SpotifyButton.png" />
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Enter a prompt..."
                    value={query}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>

            {/* Main Content */}
            <div className="content-container">
                {/* Left Section: Song List */}
                <div className="song-list-container">
                    <h2 className="playlist-title">"songs for a road trip"</h2>
                    <RefreshButton onRefresh={fetchSongsAndArtists} />
                    <div className="song-list">
                        {error ? (
                            <p className="error-text">{error}</p>
                        ) : songs.length === 0 ? (
                            <p className="empty-text">No songs found</p>
                        ) : (
                            songs.map((song, index) => (
                                <SongList
                                    // key={index}
                                    // title={song.title}
                                    // artist={song.artist}
                                    // album={song.album}
                                    // img={song.coverArt}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right Section: Popular Artists */}
                <div className="artist-section">
                    <h2 className="popular-artists-title">Popular Artists <span className="small-text">* based on your prompt</span></h2>
                    <div className="artist-grid">
                        {error ? (
                            <p className="error-text">{error}</p>
                        ) : artists.length === 0 ? (
                            <p className="empty-text">No artists found</p>
                        ) : (
                            artists.map((artist, index) => (
                                <Artist 
                                // key={artist.id} alt ={artist.name} img src={artist.image}
                                 />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};  


export default Search;
