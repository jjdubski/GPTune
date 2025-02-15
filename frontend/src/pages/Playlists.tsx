import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Song  from '../components/Song/Song'
import SongList from '../components/SongList/SongList';
import Playlist from '../components/Playlist/Playlist';

const Playlists: React.FC = () => {
    interface Playlist {
        id: number;
        trackID: string;
        title: string;
        artist: string;
        album: string;
        releaseDate: string;       
    }
    const [listIsEmpty, setListIsEmpty] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch ('http://localhost:8000/playlists/?format=json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                console.log('Data received:', data)
              
                if (data.length > 0) {
                    setListIsEmpty(false)
                }
                // setSongs(data)
                setError(null)
            })
            .catch(error => {
                console.error('Error fetching Playlists:', error)
                setError('Failed to fetch Playlists. Please try again later.')
            })
    }, [])

    return (
        <div>
            <h2>Playlist Page</h2>
            <p>This is the Playlist page. Here is the list of songs in the DB:</p>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : listIsEmpty === true  ? (
                <p style={{ color: 'red' }}>No playlists available</p>
            ) : (
                
                <Playlist title="Sample Title" img="https://example.com/sample.jpg" />
              
            )} 
            {/* <Playlist title="Sample Title" img="https://example.com/sample.jpg" /> */}
            
            <Link to="http://localhost:8000/songAPI/">See API</Link>

            {/* <Song title='Song Title' artist='Artist Name' album='Album Name' img='https://i.scdn.co/image/ab67616d0000b27348f98cb1e0e93226a15fb439' /> */}

        </div>
    )
}

export default Playlists