import React from 'react';
import './Playlist.css';


interface PlaylistProps {
    title: string;
    img : string;
}

const Playlist: React.FC<PlaylistProps> = ({title, img}) => {
    const image = 'https://seeded-session-images.scdn.co/v1/img/track/6KXxcGWj6KB5GlW1c2dhY5/en';
    return (
        <div className='playlist'>
            <img src={image} alt={`${title}`} />
            <div className='playlist-info'>
                <p>{title || 'Unknown'}</p>
            </div>
           
        </div>
    );
};
                

export default Playlist;
