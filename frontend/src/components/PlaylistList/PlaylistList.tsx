import React, { useEffect, useState } from 'react'
import './PlaylistList.css'
import Playlist  from '../Playlist/Playlist'


const PlaylistList: React.FC = () => {
    interface Playlist {
        id: number;
        title: string;
        img: string;
    }
    const [playlists, setPlaylists] = useState<Playlist[]>([])    
        useEffect(() => {
            fetch('http://localhost:8000/playlistAPI/playlists/?format=json') //if this isn't the right url I'll fix it
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()
                })
                .then(data => {
                    console.log('Data received:', data)
                    setPlaylists(data)
                })
        }, [])
    
    return (
        <div>
        {playlists.map((playlist) => (
            <div key={playlist.id}>
                {/* <p>ID: {song.id}</p>
                <p>Track ID: {song.trackID}</p>
                <p>Title: {song.title}</p>
                <p>Artist: {song.artist}</p>
                <p>Album: {song.album}</p>
                <p>Release Date: {song.releaseDate}</p> */}
                <Playlist title={playlist.title} img='https://i.scdn.co/image/ab67616d0000b27348f98cb1e0e93226a15fb439' />
            </div>

            
        ))}
    </div>
    );
};

export default PlaylistList;

