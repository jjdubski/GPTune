import React, { useState, useEffect } from "react";
import "./AddSong.css";
import plusIcon from "/plus-icon.png";

interface Song {
  title: string;
  artist: string;
  album: string;
  image: string;
  uri: string; 
  onPlay: (uri: string) => void;
}

// interface AddSongProps {
// }

const AddSong: React.FC<{ song: Song }> = ({ song }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const onAddToPlaylist = async (song: Song) => {
    try {
      const response = await fetch("http://localhost:8000/api/addSongToPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(song),
      });

      if (response.ok) {
        console.log("Song added successfully");
      } else {
        console.error("Failed to add song to playlist:", response);
      }
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = song.image;
    img.onload = () => setIsLoading(false);
  }, [song]);

  return (
   isLoading ? (
  <> </> 
): 
    <div className="add-song">
      <button 
        className="song-image-container"
        onClick={() => song.onPlay(song.uri)} 
      >
        <div className="arrow-right"></div> 

        <img className="song-image" src={song.image} alt="cover_art" />
      </button>

      <div className="song-info">
        <p className="song-title">{song.title}</p>
        <p className="song-artist">{song.artist}</p>
        <p className="song-album">{song.album}</p>
      </div>

      <button className="add-button">
        <img src={plusIcon} alt="plus-icon" className="add-icon" onClick={() => onAddToPlaylist(song)}/>
      </button>
    </div>
);   
};

export default AddSong;

