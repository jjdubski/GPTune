import React from 'react';
import './SongSelector.css';
import editIcon from "/edit.png";
 // Make sure to update the path to your edit.png

interface SongSelectorProps {
    title: string;
    artist: string;
    image: string;
    spotifyUrl: string;
}

const SongSelector: React.FC<SongSelectorProps> = ({ title, artist, image, spotifyUrl }) => {
    const handleClick = () => {
        window.open(spotifyUrl, '_blank'); 
    };

    return (
        <div className="song-card">
            <div className="song-card-image-container" onClick={handleClick}>
                <img src={image} alt={`${title} album cover`} className="song-image" />
            </div>
            <div className="song-info">
                <p className="song-title">{title}</p>
                <p className="song-artist">{artist}</p>
            </div>
            <div className="edit-icon-container">
                <img src={editIcon} alt="edit icon" className="edit-icon" />
            </div>
        </div>
    );
};

export default SongSelector;
