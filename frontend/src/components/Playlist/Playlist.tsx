import React, { useState, useEffect } from 'react';
import './Playlist.css';


interface PlaylistProps {
    playlistID: string;
    title: string;
    image : string;
    selectedPlaylistID?: string;
}



const Playlist: React.FC<PlaylistProps> = ({ playlistID, title, image, selectedPlaylistID}) => {

    const handleClick = () => {
        //window.location.href = `/playlist/${playlistID}`;
    };

    const isSelected = selectedPlaylistID === playlistID;

    useEffect(() => {
        const playlistElement = document.querySelector(`.playlist`) as HTMLElement;
        if (playlistElement && isSelected) {
            playlistElement.style.backgroundColor = 'bright green';
        } else if (playlistElement) {
            playlistElement.style.backgroundColor = '';
        }
    }, [selectedPlaylistID, playlistID, isSelected]);

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
