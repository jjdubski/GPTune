import React, { useEffect, useState } from 'react'
import './SongList.css'
import Song  from '../Song/Song'


const SongList: React.FC = () => {
    interface Song {
        trackID?: string;
        title: string;
        artist: string;
        album: string;
        image: string;
    }
    const [songs, setSongs] = useState<Song[]>([])    
        useEffect(() => {
            fetch('http://localhost:8000/songAPI/songs/?format=json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()
                })
                .then(data => {
                    console.log('Data received:', data)
                    setSongs(data)
                })
        }, [])
    
    return (
        <div className='song-list'>
        {songs.map((song) => (
            <div className="song-item" key={song.trackID}>
                {/* <p>ID: {song.id}</p>
                <p>Track ID: {song.trackID}</p>
                <p>Title: {song.title}</p>
                <p>Artist: {song.artist}</p>
                <p>Album: {song.album}</p>
                <p>Release Date: {song.releaseDate}</p> */}
                <Song title={song.title} artist={song.artist} album={song.album} image={song.image} />
            </div>
        ))}
    </div>
    );
};

export default SongList;

