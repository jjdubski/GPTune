import React, { useState, useEffect } from 'react';
import './Playlist.css';


interface PlaylistProps {
    playlistID: string;
    title: string;
    image : string;
}



const Playlist: React.FC<PlaylistProps> = ({ playlistID, title, image}) => {

    const handleClick = () => {
        //window.location.href = `/playlist/${playlistID}`;
    };

    return (
        <div className='playlist' onClick={handleClick}>
            <img src={image} alt={`${title}`} />
            <div className='playlist-info'>
                <p>{title || 'Unknown'}</p>
            </div>
        </div>
    );
};
                

export default Playlist;
