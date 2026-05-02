import React, { useState } from 'react';
import './SongSelector.css';
import editIcon from "/edit.png"; 
import Song from '../Song/Song';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    // releaseDate: string;
    image: string;
    uri: string; 
}

interface SongSelectorProps {
    title: string;
    artist: string;
    image: string;
    spotifyUrl: string;
    // songs: Song[];
    // onSelectSong: (song: Song) => void;
    isOpen: boolean;
    handleOpen: (isOpen: boolean) => void;
}

const SongSelector: React.FC<SongSelectorProps> = ({ title, artist, image, spotifyUrl, isOpen, handleOpen }) => {
    // const [isOpen, setIsOpen] = useState(false);
    // const toggleDropdown = () => {
    //     setIsOpen(!isOpen);
    // };
    const handleClick = () => {
        window.open(spotifyUrl, '_blank'); 
    };

    const displayLikedSongs = () => {
        // setIsOpen(!isOpen);
        handleOpen(!isOpen)
    };

    return (
        <div className="song-selector" onClick={displayLikedSongs}>
            <div className="song-selector-image-container" onClick={handleClick}>
                <img src={image} className="song-selector-image" />
            </div>
            <div className="song-info">
                {title && artist ? (
                    <>
                        <p className="song-title">{title}</p>
                        <p className="song-artist">{artist}</p>
                    </>
                ) : (
                    // <p className="select-song-placeholder">Select a song</p>
                    <></>
                )}
            </div>
            
            {/* Dropdown Button */}
            {/* <div className="dropdown">
                <button className="dropbtn" onClick={displayLikedSongs}>
                    <img src={editIcon} alt="edit icon" className="edit-icon" />
                </button> */}
                {/* {isOpen && (
                    <div className="dropdown-content">
                        {songs.map((song) => (
                            <div 
                                key={song.trackID} 
                                className="dropdown-item" 
                                onClick={() => {
                                    // setIsOpen(false);
                                    // handleClick(song.uri);

                                    //callback function
                                    onSelectSong(song);
                                }}
                            >
                                <img src={song.image} className="dropdown-song-image" />
                                <p className="dropdown-song-title">{song.title}</p>
                            </div>
                        ))}
                    </div>
                )} */}
            {/* </div> */}
        </div>
    );
};

export default SongSelector;