import React, { useState, useEffect } from "react";
import "./AddSong.css";
import Song from "../Song/Song";
import plusIcon from "/plus-icon.png"

interface Song {
  title: string;
  artist: string;
  album: string;
  image: string;
}

const AddSong: React.FC<{ song: Song }> = ({ song }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.src = song.image;
    img.onload = () => setIsLoading(false);
  }
  , [song]);
  
  return (
    isLoading ? (
      <></>
    ) :
    <div className="add-song">
      <img className="song-image" src={song.image} alt="cover_art"/>
      <div className="song-info">
      <p className="song-title">{song.title}</p>
      <p className="song-artist">{song.artist}</p>
      <p className="song-album">{song.album}</p>
      </div>
      <button className="add-icon-button" onClick={() => console.log("Add song clicked")}>
      <img src={plusIcon} alt="plus-icon" className="add-icon" />
      </button>
    </div>
  );
};

export default AddSong;
