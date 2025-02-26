import React, { useEffect, useState } from 'react';
//import './SongList.css';
import Song from '../Song/Song';

interface Song {
    id: number;
    trackID: string;
    title: string;
    artist: string;
    album: string;
    releaseDate: string;
    coverArt: string;
}

interface Playlist {
    id: string;
    name: string;
    coverArt: string;
}

interface SongListProps {
    playlist: Playlist;
}

const SongList: React.FC<SongListProps> = ({ playlist }) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/${playlist.id}/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json();
                setSongs(data);
            } catch (error) {
                console.error('Error fetching songs:', error);
                setError('Failed to fetch songs. Please try again later.');
            }
        };

        fetchSongs();
    }, [playlist]);

    const sendPlaylistToChatGPT = async () => {
        try {
            const response = await fetch('http://localhost:8000/generate_response/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: `Here is a playlist: ${playlist.name}. Songs: ${songs.map(song => song.title).join(', ')}`,
                    num_runs: 1
                })
            });

            const data = await response.json();
            if (response.ok) {
                setResponse(data.response);
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : songs.length === 0 ? (
                <p>No songs available</p>
            ) : (
                songs.map((song) => (
                    <div key={song.id}>
                        <Song title={song.title} artist={song.artist} album={song.album} img={song.coverArt} />
                    </div>
                ))
            )}
            <button onClick={sendPlaylistToChatGPT}>Send Playlist to ChatGPT</button>
            {response && <p>Response from ChatGPT: {response}</p>}
        </div>
    );
};

export default SongList;