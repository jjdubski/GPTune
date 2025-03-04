import React from 'react';
import './Song.css';

interface SongProps {
    title: string;
    artist: string;
    album: string;
    image: string;
    trackURL: string; 
    onPlay: (trackURI: string) => void;
}

const Song: React.FC<SongProps> = ({title, artist, album, image, trackURI, onPlay}) => {
    return (
        <div className='song'>

            <img className="song-image" src={image} alt={`${title} album cover`} />

            <div className='song-info'>
                <p className='song-title'>{title}</p>
                <p className='song-artist'>{artist}</p>
                <p className='song-album'>{album}</p>

            </div>
            <button className="play-button" onClick={() => onPlay(trackURL)}></button> {/* Play button */}
        </div>
    );
};

export default Song;
