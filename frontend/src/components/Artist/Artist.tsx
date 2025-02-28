import React from 'react';
import './Artist.css';

interface ArtistProps {
    name: string;
    image: string;
    genres: string[];
    popularity: number;
}

const Artist: React.FC<ArtistProps> = ({ name, image, genres, popularity }) => {
    return (
        <div className="artist">
            <img src={image} alt={`${name} artist cover`} className="artist-image" />
            <div className="artist-info">
                <p className="artist-name">Name: {name}</p>
                {/* <p className="artist-genres">Genres: {genres.join(', ')}</p>
                <p className="artist-popularity">Popularity: {popularity}</p> */}
            </div>
        </div>
    );
};

export default Artist;
