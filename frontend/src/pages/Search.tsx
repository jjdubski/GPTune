import React, { useState, useEffect } from 'react';
import Artist from '../components/Artist/Artist';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SongList from '../components/SongList/SongList';
import User from '../components/User/User';
import RefreshButton from '../components/RefreshIcon/RefreshIcon';
import SearchBar from '../components/SearchBar/SearchBar';
import './Search.css';

interface ArtistType {
    id: number;
    name: string;
    image: string;
    genres: string[];
    popularity: number;
}

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [songs, setSongs] = useState<any[]>([]);
    const [artists, setArtists] = useState<ArtistType[]>([
        {
            id: 1,
            name: 'Ariana Grande',
            image: 'https://via.placeholder.com/100', // Replace with actual image URL
            genres: ['Pop'],
            popularity: 95,
        },
        {
            id: 2,
            name: 'Drake',
            image: 'https://via.placeholder.com/100', // Replace with actual image URL
            genres: ['Hip-Hop'],
            popularity: 90,
        },
        {
            id: 3,
            name: 'Taylor Swift',
            image: 'https://via.placeholder.com/100', // Replace with actual image URL
            genres: ['Pop', 'Country'],
            popularity: 98,
        },
    ]); // Hardcoded artist data for testing

    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<{ email: string; username: string; image: string }>({
        email: '',
        username: '',
        image: '',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        fetch('http://localhost:8000/getUser')
            .then((res) => res.json())
            .then((data) => {
                setCurrentUser({
                    email: data.user.email || '',
                    username: data.user.display_name || '',
                    image: data.user.image || '/spotify-logo.png',
                });
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    };

    const handleSearch = () => {
        console.log('Search button clicked!');
    };

    return (
        <div className="search-page">
            {/* Top Bar - User or Spotify Button */}
            <div className="top-bar">
                {currentUser.email ? (
                    <User username={currentUser.username} image={currentUser.image} />
                ) : (
                    <div className="spotify-button-container">
                        <SpotifyButton title="Link Spotify" img="./SpotifyButton.png" />
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
                    <RefreshButton onRefresh={handleSearch} />
                    <div className="song-list">
                        {songs.length === 0 ? (
                            <p className="empty-text">No songs found</p>
                        ) : (
                            <div>
                                {songs.map((song) => (
                                    <div key={song.id}>
                                        <SongList title={song.title} artist={song.artist} album={song.album} img={song.coverArt} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Popular Artists */}
                <div className="artist-section">
                    <h2 className="popular-artists-title">Popular Artists <span className="small-text">* based on your prompt</span></h2>
                    <div className="artist-grid">
                        {artists.map((artist) => (
                            <div key={artist.id}>
                                <Artist name={artist.name} image={artist.image} genres={artist.genres} popularity={artist.popularity} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
