import React, { useState, useEffect } from 'react';
import './Playlist.css';
import { useNavigate } from 'react-router-dom';


interface PlaylistProps {
    id: number;
    title: string;
    image : string;
}

const Playlist: React.FC<PlaylistProps> = ({id, title, img}) => {
    const navigate = useNavigate();
    const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
        if (id !== undefined) {
            navigate(`/playlist/${id}`);
        } else {
            console.error('Playlist id is undefined');
        }
    };

    return (
        <div className='playlist' onClick={handleClick}>
            <img src={img} alt={`${title}`} />
            <div className='playlist-info'>
                <p>{title || 'Unknown'}</p>
            </div>
        </div>
    );
};
                

export default Playlist;
