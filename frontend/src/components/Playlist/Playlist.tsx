import React from 'react';
import './Playlist.css';


interface PlaylistProps {
    title: string;
    img : string;
}

const Playlist: React.FC<PlaylistProps> = ({title, img}) => {
    return (
        <div className='playlist'>
            <img src={img} alt={`${title}`} />
            <div className='playlist-info'>
                <p>{title || 'Unknown'}</p>
            </div>
        </div>
    );
};
                

export default Playlist;
