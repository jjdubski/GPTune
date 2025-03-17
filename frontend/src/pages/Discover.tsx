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
    const fetchSongs = useCallback(async (category: string, setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
        if (hasFetchedSongs.current) return;

        console.log(`Fetching ${category} songs...`); //just for debug
        const requestData = {
            prompt: `Give me songs that are in ${category} category, you are an AI recommendation bot. Recommend unique songs.`,
            num_runs: 5,
            userInfo: "True"
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
        
            const res = await fetch('http://127.0.0.1:8000/getSongsForGenre/');
            const data = await res.json();
    
            if (res.ok && data.genre && data.subgenre && data.songs) {
                localStorage.setItem("GOTD_GENRE", JSON.stringify({ ...data, timestamp: now }));
                setGenre(data.genre);
                setSubgenre(data.subgenre);
                setGOTDSongs(data.songs);
            } else {
                console.error("Error fetching genre songs:", data);
            }
        } catch (error) {
            console.error("Error fetching genre songs:", error);
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
        fetchSongs("new", setNewSongs);
        fetchSongs("trending", setTrendingSongs);
        fetchGenreAndSubgenre().then(({ genre, subgenre }) => {
            if (genre && subgenre) {
                console.log(`Fetching songs for ${genre} - ${subgenre}...`);
                setGenre(genre);
                setSubgenre(subgenre);
                fetchGOTD(genre, subgenre, setGOTDSongs);
            }
        });
    
        hasFetchedSongs.current = true;
    }, []);
    
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
                    {genre && subgenre ? `GENRE OF THE DAY - ${subgenre}` : "Genre of the Day"}
                </h2>                    
                    <SongList tracks={gotdSongs} />
                </div>
            </div>
        </div>
    );
};

export default Discover;

