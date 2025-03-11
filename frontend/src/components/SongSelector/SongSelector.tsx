import React, { useState } from 'react';
import './SongSelector.css';
import editIcon from "/edit.png"; 
import Song from '../Song/Song';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    // releaseDate: string;
    image: string;
    uri: string; 
}

interface SongSelectorProps {
    title: string;
    artist: string;
    image: string;
    spotifyUrl: string;
    songs: Song[];}

const SongSelector: React.FC<SongSelectorProps> = ({ title, artist, image, spotifyUrl, songs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const handleClick = () => {
        window.open(spotifyUrl, '_blank'); 
    };

    return (
        <div className="song-selector">
            <div className="song-selector-image-container" onClick={handleClick}>
                <img src={image} alt="cover art" className="song-selector-image" />
            </div>
            <div className="song-info">
                <p className="song-title">{title}</p>
                <p className="song-artist">{artist}</p>
            </div>
            
            {/* Dropdown Button */}
            <div className="dropdown">
                <button className="dropbtn" onClick={toggleDropdown}>
                    <img src={editIcon} alt="edit icon" className="edit-icon" />
                </button>
                {isOpen && (
                    <div className="dropdown-content">
                        {songs.map((song) => (
                            <div 
                                key={song.trackID} 
                                className="dropdown-item" 
                                onClick={() => {
                                    setIsOpen(false);
                                    // handleClick(song.uri);
                                }}

                            >
                                <img src={song.image} alt={`${song.title} album cover`} className="dropdown-song-image" />
                                <p className="dropdown-song-title">{song.title}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongSelector;