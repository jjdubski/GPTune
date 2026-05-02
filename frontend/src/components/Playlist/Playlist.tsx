import React from 'react';
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
    
    return (
        <div className={`playlist ${isSelected ? 'selected-playlist' : ''}`} onClick={handleClick}>
            <img src={image} alt={`${title}`} />
            <div className='playlist-info'>
                <p>{title || 'Unknown'}</p>
            </div>
        </div>
    );
};
                

export default Playlist;
