import React, { useState, useEffect } from "react";
import "./AddSong.css";
import Song from "../Song/Song";
import plusIcon from "/plus-icon.png"

interface Song {
  title: string;
  artist: string;
  album: string;
  image: string;
  uri: string;
}

const AddSong: React.FC<{ song: Song }> = ({ song }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.src = song.image;
    img.onload = () => setIsLoading(false);
  }
  , [song]);
  const changeSong = async () => {
    const requestData = {
        uri: uri
    }
     console.log('Changing song to:', uri);
    try{
        await fetch ('http://localhost:8000/songAPI/playSong/',{ 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
    }
    catch (error){  
        console.error('Error changing song:', error);
    }
  }
  
  return (
    isLoading ? (
      <></>
    ) :
    <div className="add-song" onClick={changeSong}>
      <img className="song-image" src={song.image} alt="cover_art" />
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
