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
    const [gotdSongs, setGOTDSongs] = useState<Song[]>([]);
    const [genre, setGenre] = useState<string | null>(null);
    const [subgenre, setSubgenre] = useState<string | null>(null);
    const hasFetchedSongs = useRef(false);

    // Function to fetch songs based on category
    const fetchDiscoverSongs = useCallback(async () => {
        const storedData = localStorage.getItem("DISCOVER_SONGS");
        const now = new Date().getTime();

        if (storedData) {
            const discoverData = JSON.parse(storedData);

            // Check if cache is still valid (24 hours)
            if (now - discoverData.timestamp < 86400000) {
                console.log("Using cached discover songs");
                setNewSongs(discoverData.new);
                setTrendingSongs(discoverData.trending);
                return;
            }
        }

        console.log("Fetching new discover songs from API...");

        try {
            console.log("Fetching discover songs...");
    
            const res = await fetch('http://127.0.0.1:8000/api/discover/');

            
            if (!res.ok) {
                console.error(`Error fetching discover songs: ${res.status} ${res.statusText}`);
                return;
            }
    
            const data = await res.json();
            
            if (!data || !data.new || !data.trending) {
                console.error("Invalid API response:", data);
                return;
            }
    
            console.log("Fetched discover songs:", data);
            setNewSongs(data.new);
            setTrendingSongs(data.trending);
            localStorage.setItem("DISCOVER_SONGS", JSON.stringify({ ...data, timestamp: Date.now() }));
    
        } catch (error) {
            console.error("Error fetching discover songs:", error);
        }
    }, []);


    const fetchGenreAndSubgenre = useCallback(async () => {
        const storedData = localStorage.getItem("GOTD_GENRE");
        const now = new Date().getTime();
    
        if (storedData) {
            const genreData = JSON.parse(storedData);
    
            if (now - genreData.timestamp < 86400000 && genreData.songs && genreData.songs.length > 0) {
                console.log(`Using stored genre: ${genreData.genre} - ${genreData.subgenre}`);
                setGenre(genreData.genre);
                setSubgenre(genreData.subgenre);
                setGOTDSongs(genreData.songs); 
                return;
            }
        }
    
        console.log("Fetching new genre, subgenre, and songs...");
    
        try {
            console.log("Fetching Genre of the Day...");
    
            const res = await fetch('http://127.0.0.1:8000/getSongsForGenre/');
    
            if (!res.ok) {
                console.error(`Error fetching genre: ${res.status} ${res.statusText}`);
                return;
            }
    
            const data = await res.json();
    
            if (!data || !data.genre || !data.subgenre || !data.songs) {
                console.error("Invalid genre response:", data);
                return;
            }
    
            console.log("Fetched genre:", data.genre, "-", data.subgenre);
            setGenre(data.genre);
            setSubgenre(data.subgenre);
            setGOTDSongs(data.songs);
            localStorage.setItem("GOTD_GENRE", JSON.stringify({ ...data, timestamp: Date.now() }));
    
        } catch (error) {
            console.error("Error fetching genre:", error);
        }
    }, []);
    
    
    
    // Fetch genre of the day
    const fetchGOTD = useCallback(async (genre: string, subgenre: string, setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
        console.log(`Fetching GOTD songs for ${genre} -> ${subgenre}...`);
        const requestData = {
            prompt: `Recommend unique songs from the ${subgenre} subgenre of ${genre}. You are an AI recommendation bot. Recommend unique songs.`,
            num_runs: 5,
            userInfo: "True"
        };
    
        try {
            const res = await fetch('http://127.0.0.1:8000/getRecommendations/', {
                method: 'POST',  
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)  
            });
    
            const data = await res.json();
            console.log("GOTD API Response:", data);
    
            if (res.ok && data.songs) {
                const songList: Song[] = Object.values(data.songs).map((item) => ({
                    trackID: item.trackID,
                    title: item.title,
                    artist: item.artist,
                    album: item.album,
                    image: item.image,  
                    uri: item.uri
                }));
    
                setSongs(songList);
                console.log("Fetched GOTD Songs:", songList);
            } else {
                console.error(`Error fetching GOTD songs:`, data);
            }
        } catch (error) {
            console.error(`Error fetching GOTD songs:`, error);
        }
    }, []);

    // Fetch all categories on component mount
    useEffect(() => {
        if (!hasFetchedSongs.current) {
            fetchDiscoverSongs();
    
            fetchGenreAndSubgenre().then(() => {
                if (genre && subgenre) {
                    console.log(`Fetching GOTD songs for ${genre} - ${subgenre}`);
                    fetchGOTD(genre, subgenre, setGOTDSongs);
                }
            });
    
            hasFetchedSongs.current = true;
        }
    }, [fetchDiscoverSongs, fetchGenreAndSubgenre]);
    
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
                <h2 className="category-title classics">
                    {genre && subgenre ? `GOTD - ${subgenre}` : "Genre of the Day"}
                </h2>                    
                    <SongList tracks={gotdSongs} />
                </div>
            </div>
        </div>
    );
};

export default Discover;

