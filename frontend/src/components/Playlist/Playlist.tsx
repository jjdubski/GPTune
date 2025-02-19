import React, { useEffect, useState } from 'react'; 
import './Playlist.css';
import Song from '../Song/Song.tsx';


//dev links:
//https://react.dev/reference/react/useEffect
//https://react.dev/reference/react/useState 
//

interface PlaylistProps {
    pname: string;
    img : string;
}

//playlist itself, not list
const Playlist: React.FC<PlaylistProps> = ({pname, img}) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const image = 'https://seeded-session-images.scdn.co/v1/img/track/6KXxcGWj6KB5GlW1c2dhY5/en';
    
    useEffect(() => {
        fetch('http://localhost:8000/songAPI/songs/?format=json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error: Failed to connect to localhost:8000');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data success:', data);
                setSongs(data);
            });
    }, []);
    
    return (
        <div className="playlistElement">
            {songs.length > 0 ? ( //note to self: this is a loop. just looks weird.
                songs.map((song) => ( //map each song to each element
                    <div key={song.id} className="playlist"> 
                        <img 
                            src='https://seeded-session-images.scdn.co/v1/img/track/6KXxcGWj6KB5GlW1c2dhY5/en'
                            alt={song.title}  //alt in case link explodes
                        />
                        <div className="playlist-info"> 
                            <p><strong>{song.title}</strong></p>
                            <p>{song.artist}</p>
                            <p>{song.album}</p>
                            <p>{song.img}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="playlist-info">Playlist is empty. What, do you not listen to music?</p>
            )}
        </div>
    );
};
                

export default Playlist;
