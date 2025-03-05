import React, { useState, useEffect } from "react";
import "./AddSong.css";
import plusIcon from "/plus-icon.png";

interface Song {
  trackID: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  uri: string; 
  onPlay: (uri: string) => void;
}

// interface Playlist {
//   playlistID: string;
//   name: string;
//   image: string;
// }
interface AddSongProps{
  song: Song
  onAddSong: (trackID: string) => void;
}



const AddSong: React.FC<AddSongProps> = ({ song, onAddSong }) => {
  const [isLoading, setIsLoading] = useState(true);

  // const onAddToPlaylist = async () => {
  //   // if (!selectedPlaylist) {
  //   //   console.error("No playlist selected");
  //   //   return;
  //   // }

  //   const requestData = {
  //     // playlist: selectedPlaylist,
  //     song: song,
  //   };

  //   try {
  //     const response = await fetch("http://localhost:8000/playlistAPI/addSongToPlaylist", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     if (response.ok) {
  //       // console.log("Song added successfully to", selectedPlaylist);

  //     } else {
  //       console.error("Failed to add song to playlist:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error adding song:", error);
  //   }
  // };

  useEffect(() => {
    const img = new Image();
    img.src = song.image;
    img.onload = () => setIsLoading(false);
  }, [song]);

  const changeSong = async () => {
    const requestData = {
      uri: song.uri,
    };
    console.log("Changing song to:", song.uri);
    try {
      await fetch("http://localhost:8000/songAPI/playSong/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
    } catch (error) {
      console.error("Error changing song:", error);
    }
  };

  return isLoading ? null : (
    <div className="add-song" onClick={changeSong}>
      <img className="song-image" src={song.image} alt={song.title} />
      <div className="song-info">
        <p className="song-title">{song.title}</p>
        <p className="song-artist">{song.artist}</p>
        <p className="song-album">{song.album}</p>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <button className="add-button" onClick={(e) => {
          e.stopPropagation();
          console.log("Adding song: ", song.trackID);
          onAddSong(song.trackID);
        }}>
          <img src={plusIcon} alt="plus-icon" className="add-icon" />
        </button>
      </div>
    </div>
  );   
};

export default AddSong;

