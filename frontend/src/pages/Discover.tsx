import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Discover.css';
import SongList from '../components/SongList/SongList';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    uri: string;
}

const Discover: React.FC = () => {
    const [newSongs, setNewSongs] = useState<Song[]>([]);
    const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
    const [classicSongs, setClassicSongs] = useState<Song[]>([]);
    const hasFetchedSongs = useRef(false);

    // Function to fetch songs based on category
    const fetchSongs = useCallback(async (category: string, setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
        if (hasFetchedSongs.current) return;

        const requestData = {
            prompt: `Give me the most popular ${category} songs`,
            num_runs: 5,
            userInfo: "False"
        };

        try {
            const res = await fetch('http://127.0.0.1:8000/getRecommendations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await res.json();
            if (res.ok) {
                const songList: Song[] = Object.values(data.songs as { 
                    trackID: string; 
                    title: string; 
                    artist: string;
                    album: string; 
                    image: string; 
                    uri: string;
                }[]).map((item) => ({
                    trackID: item.trackID,
                    title: item.title,
                    artist: item.artist,
                    album: item.album,
                    image: item.image,
                    uri: item.uri
                }));

                setSongs(songList);
            } else {
                console.error(`Error fetching ${category} songs:`, data);
            }
        } catch (error) {
            console.error(`Error fetching ${category} songs:`, error);
        }
    }, []);

    // Fetch all categories on component mount
    useEffect(() => {
        fetchSongs("new", setNewSongs);
        fetchSongs("trending", setTrendingSongs);
        fetchSongs("classic", setClassicSongs);
        hasFetchedSongs.current = true;
    }, [fetchSongs]);

    return (
        <div className="discover-container">
            <h1 className="discover-title">DISCOVER</h1>
            <div className="categories">
                <div className="category">
                    <h2 className="category-title new">NEW</h2>
                    <SongList tracks={newSongs} />
                </div>
                <div className="category">
                    <h2 className="category-title trending">TRENDING</h2>
                    <SongList tracks={trendingSongs} />
                </div>
                <div className="category">
                    <h2 className="category-title classics">CLASSICS</h2>
                    <SongList tracks={classicSongs} />
                </div>
            </div>
        </div>
    );
};

export default Discover;