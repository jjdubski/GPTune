import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Songs: React.FC = () => {
    const [songs, setSongs] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('http://0.0.0.0:8000/songAPI/songs/?format=json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                console.log('Data received:', data)
                setSongs(data)
                setError(null)
            })
            .catch(error => {
                console.error('Error fetching songs:', error)
                setError('Failed to fetch songs. Please try again later.')
            })
    }, [])

    return (
        <div>
            <h2>Songs Page</h2>
            <p>This is the songs page. Here is the list of songs in the DB:</p>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : songs.length === 0 ? (
                <p style={{ color: 'red' }}>No songs available</p>
            ) : (
                <div>
                    {songs.map((song) => (
                        <div key={song.id}>
                            <p>ID: {song.id}</p>
                            <p>Track ID: {song.trackID}</p>
                            <p>Title: {song.title}</p>
                            <p>Artist: {song.artist}</p>
                            <p>Album: {song.album}</p>
                            <p>Release Date: {song.releaseDate}</p>
                        </div>
                    ))}
                </div>
            )}
            <Link to="http://localhost:8000/songAPI/">See API</Link>
        </div>
    )
}

export default Songs