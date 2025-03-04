import React, { useState, useEffect } from "react";
import "./AddSong.css";
import plusIcon from "/plus-icon.png";

interface Song {
  title: string;
  artist: string;
  album: string;
  image: string;
  trackURI: string; 
  onPlay: (trackURI: string) => void;
}

const AddSong: React.FC<{ song: Song }> = ({ song }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = song.image;
    img.onload = () => setIsLoading(false);
  }, [song]);

  return isLoading ? 
  <></>
 : (
    <div className="add-song">
      <button 
        className="song-image-container"
        onClick={() => song.onPlay(song.trackURI)} 
      >
        <div className="arrow-right"></div> 

        <img className="song-image" src={song.image} alt="cover_art" />
      </button>

      <div className="song-info">
        <p className="song-title">{song.title}</p>
        <p className="song-artist">{song.artist}</p>
        <p className="song-album">{song.album}</p>
      </div>

      <img src={plusIcon} alt="plus-icon" className="add-icon" />
    </div>
  );
};

export default AddSong;

