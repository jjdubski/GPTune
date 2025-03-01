import React from 'react';
import './Song.css';

interface SongProps {
    title: string;
    artist: string;
    album: string;
    image : string;
}

const Song: React.FC<SongProps> = ({title, artist, album, image}) => {
    return (
        <div className='song'>
            <img className="song-image" src={image} alt={`${title} album cover`} />
            <div className='song-info'>
                <p className='song-title'>{title}</p>
                <p className='song-artist'>{artist}</p>
                <p className='song-album'>{album}</p>
            </div>
        </div>
    );
};

export default Song;