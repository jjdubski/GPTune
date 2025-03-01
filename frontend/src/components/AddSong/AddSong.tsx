import React from "react";
import "./AddSong.css";
import Song from "../Song/Song";
import plusIcon from "/plus-icon.png"

interface Song {
  trackID: string;
  title: string;
  artist: string;
  album: string;
  image: string;
}

const AddSong: React.FC<{ song: Song }> = ({ song }) => {
  return (
    <div className="add-song">
      <img className="song-image" src={song.image} alt="cover_art"/>
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
