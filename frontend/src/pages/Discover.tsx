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

    // Fetch genre and subgenre from GPT
    const fetchGenreAndSubgenre = useCallback(async () => {
        const storedData = localStorage.getItem("GOTD_GENRE");
        const now = new Date().getTime();
    
        if (storedData) {
            const { genre, subgenre, timestamp } = JSON.parse(storedData);
            if (now - timestamp < 24 * 60 * 60 * 1000) {
                console.log(`Using stored genre: ${genre} - ${subgenre}`);
                setGenre(genre);
                setSubgenre(subgenre);
                return { genre, subgenre };
            }
        }
    
        console.log("Fetching new genre and subgenre...");
    
        try {
            const res = await fetch('http://127.0.0.1:8000/getGenreAndSubgenre/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: "Pick a musical genre and one of its subgenres." })
            });

            const data = await res.json();
            if (res.ok && data.genre && data.subgenre) {
                console.log(`Fetched new genre: ${data.genre} - ${data.subgenre}`);
                localStorage.setItem(
                    "GOTD_GENRE",
                    JSON.stringify({ genre: data.genre, subgenre: data.subgenre, timestamp: now })
                );
                setGenre(data.genre);
                setSubgenre(data.subgenre);
                return { genre: data.genre, subgenre: data.subgenre };
            } else {
                console.error("Error fetching genre:", data);
            }
        } catch (error) {
            console.error("Error fetching genre:", error);
        }
    
        return { genre: "Rock", subgenre: "Alternative Rock" }; // Fallback
    }, []);

    // Fetch genre of the day
    const fetchGOTD = useCallback(async (genre: string, subgenre: string, setSongs: React.Dispatch<React.SetStateAction<Song[]>>) => {
        if (hasFetchedSongs.current) return;

        console.log(`Fetching GOTD songs for ${genre} -> ${subgenre}...`); // Debugging

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
                setGenre(genre);
                setSubgenre(subgenre);
            } else {
                console.error(`Error fetching songs:`, data);
            }
        } catch (error) {
            console.error(`Error fetching songs:`, error);
        }
    }, []);

    // Fetch all categories on component mount
    useEffect(() => {
        fetchSongs("new", setNewSongs);
        fetchSongs("trending", setTrendingSongs);

        fetchGenreAndSubgenre().then(({ genre, subgenre }) => {
            if (genre && subgenre) {
                fetchGOTD(genre, subgenre, setGOTDSongs);
            }
        });

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

