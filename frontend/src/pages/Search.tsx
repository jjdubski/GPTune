import React, { useState } from 'react';
import Artist from '../components/Artist/Artist';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SongList from '../components/SongList/SongList';
import User from '../components/User/User';
import UserButton from '../components/UserButton/UserButton';
import './Search.css';

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    return (
        <div className="search-page">
            {/* Top Section with User and Spotify Button */}
            <div className="top-bar">
                <User />
                <SpotifyButton title="Link Spotify" img="./SpotifyButton.png" />
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
            </div>

            {/* Main Content - Left (Song List) and Right (Popular Artists) */}
            <div className="content-container">
                {/* Left Section: Song List */}
                <div className="song-list-container">
                    <SongList query={query} />
                </div>

                {/* Right Section: Popular Artists */}
                <div className="artist-section">
                    <h2 className="popular-artists-title">Popular Artists</h2>
                    <Artist />
                </div>
            </div>

            {/* Bottom Section with User Button */}
            <div className="user-button-container">
                <UserButton />
            </div>
        </div>
    );
};

export default Search;
