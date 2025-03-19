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

    const [isLoading, setIsLoading] = useState(true);
    //check if user is logged in
    // checks if user is logged in, redirects to login page if not
            useEffect(() => {
                fetch('http://localhost:8000')
                    .then((res) => res.json())
                    .then((data) => {
                        if (!data.user || !data.user.email) {
                            window.location.href ="http://127.0.0.1:8000/login/"; // Redirect to login page
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }, []);

    // Function to fetch songs based on category
    const fetchDiscoverSongs = useCallback(async () => {
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
            setGOTDSongs(data.GOTD.songs);
            setGenre(data.GOTD.genre);
            setSubgenre(data.GOTD.subgenre);
            localStorage.setItem("DISCOVER_SONGS", JSON.stringify({ ...data, timestamp: Date.now() }));
    
        } catch (error) {
            console.error("Error fetching discover songs:", error);
        }
    }, []);
    useEffect(() => {
        if (!hasFetchedSongs.current) {
            fetchDiscoverSongs();
            hasFetchedSongs.current = true;
        }
    }, [fetchDiscoverSongs]);

    return (
        isLoading ? (
            <div></div>
        ) : (
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
        )
    );
};

export default Discover;

