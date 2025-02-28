import React, { useState, useEffect } from 'react';
import Artist from '../components/Artist/Artist';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SongList from '../components/SongList/SongList';
import User from '../components/User/User';
import RefreshButton from '../components/RefreshIcon/RefreshIcon'; 
import SearchBar from '../components/SearchBar/SearchBar';
import './Search.css';
import Song from '../components/Song/Song';

const Search: React.FC = () => {
    // const [query, setQuery] = useState<string>(''); 
    const [songs, setSongs] = useState<any[]>([]); 
    const [artists, setArtists] = useState<any[]>([]); 
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<{ email: string; username: string; image: string }>({
        email: '',
        username: '',
        image: ''
    });

    useEffect(() => {
        // fetchSongsAndArtists();
        fetchUserData();
    }, []);

    const fetchSongsAndArtists = () => {
        return 
    }

    // const fetchSongsAndArtists = () => {
        // fetch(`http://localhost:8000/musicAPI/search?query=${query}`)
        //     .then((response) => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then((data) => {
        //         console.log('Data received:', data);
        //         setSongs(data.songs || []);
        //         setArtists(data.artists || []);
        //         setError(null);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching music data:', error);
        //         setError('Failed to fetch music data. Please try again later.');
        //     });

        // work with John to add route that returns an array of songs and artists (seperately)
        // break this down to two different fetch calls, one for each
    // };

    const fetchUserData = () => {
        fetch('http://localhost:8000/getUser')
            .then((res) => res.json())
            .then((data) => {
                setCurrentUser({
                    email: data.user.email || '',
                    username: data.user.display_name || '',
                    image: data.user.image || '/spotify-logo.png'
                });
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    };

    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setQuery(event.target.value);
    // };

    // const handleSearch = () => {
    //     fetchSongsAndArtists();
    // };

    return (
        <div className="search-page">
            {/* Top Bar - User or Spotify Button */}
            <div className="top-bar">
                {currentUser.email ? (
                    <User username={currentUser.username} image={currentUser.image} />
                ) : (
                    <div className="spotify-button-container">
                        <SpotifyButton 
                            title="Link Spotify" 
                            img="./SpotifyButton.png" 
                            // onClick={() => window.location.href = "http://127.0.0.1:8000/login/"} 
                        />
                    </div>
                )}
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Main Content */}
            <div className="content-container">
                {/* Left Section: Song List */}
                <div className="song-list-container">
                    <h2 className="playlist-title">"songs for a road trip"</h2>
                    <RefreshButton onRefresh={fetchSongsAndArtists} />
                    {/* make it work with the list of songs */}
                    {/* <SongList songs={songs}/> */}
                    <SongList />
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
                                <div key={index} className="artist-card">
                                    <img src={artist.image} alt={artist.name} className="artist-image" />
                                    <p className="artist-name">{artist.name}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
