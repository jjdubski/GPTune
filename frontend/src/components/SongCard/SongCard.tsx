import React from 'react';
import './SongCard.css';

interface SongCardProps {
    title: string;
    artist: string;
    album: string;
    image: string;
    // onNext: () => void; // Function to handle song switching
}

const SongCard: React.FC<SongCardProps> = ({ title, artist, album, image,  }) => {
    return (
        <div className="song-card">
            <img src={image} alt={`${title} album cover`} className="song-card-image" />
            <div className="song-card-info">
                <p className="song-card-title">{title}</p>
                <p className="song-card-artist">{artist}</p>
                <p className="song-card-album">{album}</p>
            </div>
            {/* <button className="next-song-btn" onClick={onNext}>✅</button>  */}
        </div>
    );
};

export default SongCard;
