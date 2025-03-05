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
    uri: string;
}

interface Playlist {
    id: string;
    name: string;
    coverArt: string;
    description: string; // Add description to the Playlist interface
}

interface SongListProps {
    playlist: Playlist;
}

const RecommendedSongList: React.FC<SongListProps> = ({ playlist }) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState('');


    

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/3pUTn00JKBOCtESciWxtKQ/`);
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

        const fetchData = async () => {
            await fetchSongs();
            sendPlaylistToChatGPT()

        }
        
        fetchData();
    }, [playlist]);

    const sendPlaylistToChatGPT = async () => {
        const requestData = {
            prompt: `Here is a playlist: ${playlist.name}. Songs: ${songs.map(song => song.title).join(', ')}`,
            num_runs: 1
        };
        try {
            const res = await fetch('http://127.0.0.1:8000/generate_response/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await res.json();
            if (res.ok) {
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
                        <Song trackID = {song.trackID} title={song.title} artist={song.artist} album={song.album} image={song.coverArt} uri = {song.uri}/>
                    </div>
                ))
            )}
            <button onClick={sendPlaylistToChatGPT}>Send Playlist to ChatGPT</button>
            <p>Response from ChatGPT: {response}</p>
        </div>
    );
};

export default RecommendedSongList;