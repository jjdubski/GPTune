import React from 'react';
import './Playlist.css';
import { useNavigate } from 'react-router-dom';


interface PlaylistProps {
    playlistID: string;
    title: string;
    img : string;
}

const Playlist: React.FC<PlaylistProps> = ({playlistID, title, img}) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/playlist/${playlistID}`);
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
