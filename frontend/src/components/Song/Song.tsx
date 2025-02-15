import React from 'react';
import './Song.css';

interface SongProps {
    title: string;
    artist: string;
    album: string;
    img : string;
}

const Song: React.FC<SongProps> = ({title, artist, album, img}) => {
    return (
        <div className='song'>
            <img src={img} alt={`${title} album cover`} />
            <div className='song-info'>
                <p>Title: {title}</p>
                <p>Artist: {artist}</p>
                <p>Album: {album}</p>
            </div>
           
        </div>
    );
};
   

export default Song;