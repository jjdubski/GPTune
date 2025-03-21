import React, { useState, useEffect } from 'react';
import Artist from '../components/Artist/Artist';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SongList from '../components/SongList/SongList';
import User from '../components/User/User';
import RefreshButton from '../components/RefreshButton/RefreshButton';
import SearchBar from '../components/SearchBar/SearchBar';
import './Search.css';
import Song from '../components/Song/Song';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    // releaseDate: string;
    image: string;
    uri: string; 
}

interface Artist {
    id: number;
    name: string;
    image: string;
    genres?: string[];
    popularity?: number;
    url : string;
}

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>(''); 
    const [songs, setSongs] = useState<Song[]>([]); 
    const [artists, setArtists] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSongs, setIsLoadingSongs] = useState(false);
    const [isLoadingArtists, setIsLoadingArtists] = useState(false);
    

    const [currentUser, setCurrentUser] = useState<{ email: string; username: string; image: string }>({
        email: '',
        username: '',
        image: '',
    });

    const fetchSongsAndArtists = async (query: string) => {
        // setError(null);
        setIsLoadingSongs(true);
        setIsLoadingArtists(true);
        try {
            const response = await fetch(`http://localhost:8000/musicAPI/search?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            console.log("API Response: ", data)
            if (response.ok) {
                const songList: Song[] = Object.values(data.songs as { 
                        trackID: string; 
                        title: string; 
                        artist: string;
                        album: string; 
                        image: string; 
                        uri:string;
                    }[]).map((item) => ({
                        trackID: item.trackID,
                        title: item.title,
                        artist: item.artist,
                        album: item.album,
                        image: item.image,
                        uri: item.uri
                }));
                setSongs(songList);
                setArtists(data.artists || []);
            } else {
                console.error('Error:', data);
                setError('Please try a different prompt.');
            }
            setIsLoadingSongs(false);
            setIsLoadingArtists(false);
        } catch (error) {
            console.error("Error fetching music data:", error);
            setError("Failed to fetch music data. Please try again later.");
        }
    };
    
    useEffect(() => {
        const storedQuery = localStorage.getItem("searchQuery");
        if (storedQuery) {
            setQuery(storedQuery)
            fetchSongsAndArtists(storedQuery);
            localStorage.removeItem("searchQuery");  // Clear after fetching
        }
        setIsLoading(false);
    }, []);
    
    useEffect(() => {
        fetch('http://localhost:8000')
            .then(res => res.json())
            .then(data => {
                setCurrentUser({
                    email: data.user.email || '',
                    username: data.user.display_name || '',
                    image: data.user.image || '/spotify-logo.png'
                });
                console.log("User:", data);
                setIsLoading(false);
            });
    }, []);



    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setQuery(event.target.value);
    // };

    const handleSearch = (query: string) => {
        setQuery(query);
        setError(null);
        localStorage.setItem("searchQuery", query);
        fetchSongsAndArtists(query);
    };

    const handleRefresh = () => {
        fetchSongsAndArtists(query);
    };

    return (
        isLoading ? (
            <></>
        ) : (
        <div className="search-page">
            {currentUser.email ? (
                <User username={currentUser.username} image={currentUser.image} />
            ) : (
                <div className="spotify-button-container">
                    <SpotifyButton title="Link Spotify" img="./SpotifyButton.png" />
                </div>
            )}

            {/* Main Content */}
            {/* <div className="search-page-container"> */}
                {/* Left Section: Song List */}
                <div className="song-list-section">
                    <div className="song-list-section-top">
                        <RefreshButton styles={{opacity: 0}} onRefresh={() => {}} /> { /* This one is not displayed */}
                        <h2 className="song-list-section-title">Songs matching: "{query}"</h2>
                        <RefreshButton onRefresh={handleRefresh} />
                    </div>
                    <div className="scroll">
                      
                    {error ? (
                        <></>
                    ) : isLoadingSongs ? (
                        <p>Loading Songs...</p>
                    ) : (
                        <SongList tracks={songs} />
                    )}

                    </div>
                </div>
                <div className="artist-section">
                    <h2 className="above-prompt">Not what you are looking for? Enter a new prompt.</h2>
                    <SearchBar onSearch={handleSearch} />
                    {/* <SearchBar onSearch={() => console.log('Search button clicked!')} /> */}
                        <h2 className="popular-artists-title">Popular Artists <span className="small-text">* based on your prompt</span></h2>
                        <div className="artist-grid">
                            {error ? (
                                <p className="error-text" style={{ color: 'red' }}>{error}</p>
                            ) : isLoadingArtists ? (
                                <p>Loading Artists...</p>
                            ) : artists.length === 0 ? (
                                <p className="empty-text">No artists found</p>
                            ) : (
                                artists.map((artist, index) => (
                                    <Artist
                                        key={index}
                                        name={artist.name}
                                        image={artist.image}
                                        // genres={artist.genres}
                                        // popularity={artist.popularity}
                                        url = {artist.url}
                                    />
                                ))
                            )}
                        </div>
                </div>
            {/* </div> */}
        </div>
    )); 
};

export default Search;
