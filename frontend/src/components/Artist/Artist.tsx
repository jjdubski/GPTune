import React from 'react';
import './Artist.css';

interface ArtistProps {
    name: string;
    image: string;
    genres?: string[];
    popularity?: number;
    url: string;  // URL for the artist's Spotify page
}

const Artist: React.FC<ArtistProps> = ({ name, image, url }) => {
    const handleClick = () => {
        window.open(url, '_blank'); // Opens URL in a new tab
    };

    return (
        <div className="artist" onClick={handleClick} >
            <img src={image} alt={`${name} artist cover`} className="artist-image" />
            <div className="artist-info">
                <p className="artist-name">{name}</p>
                {/* <p className="artist-genres">Genres: {genres.join(', ')}</p>
                <p className="artist-popularity">Popularity: {popularity}</p> */}
            </div>
        </div>
    );
};

export default Artist;
