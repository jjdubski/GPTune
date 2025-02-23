import React from "react";
import Song  from '../Song/Song'
import "./AddSong.css";

interface AddSongProps {
  title: string;
  artist: string;
  album: string;
  img: string;
  onAdd: () => void;
}

const AddSong: React.FC<AddSongProps> = ({ title, artist, album, img, onAdd }) => {
  return (
    <div className="add-song">
      <Song title={title} artist={artist} album={album} img={img} />
      <button className="add-button" onClick={onAdd}>➕</button>
    </div>
  );
};

export default AddSong;