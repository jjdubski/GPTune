import React, { useState, useEffect } from 'react';
import Artist from '../components/Artist/Artist';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SongList from '../components/SongList/SongList';
import User from '../components/User/User';
import RefreshButton from '../components/RefreshButton/RefreshButton';
import SearchBar from '../components/SearchBar/SearchBar';
import './Search.css';
import Song from '../components/Song/Song';

interface Artist {
    id: number;
    name: string;
    image: string;
    genres?: string[];
    popularity?: number;
}

const Search: React.FC = () => {
    // const [query, setQuery] = useState<string>(''); 
    const [songs, setSongs] = useState<any[]>([]); 
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [artists, setArtists] = useState<Artist[]>([])

    const [currentUser, setCurrentUser] = useState<{ email: string; username: string; image: string }>({
        email: '',
        username: '',
        image: '',
    });

    const fetchSongsAndArtists = async (query: string) => {
        setIsLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`http://localhost:8000/musicAPI/search?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            setSongs(data.songs || []);
            setArtists(data.artists || []);
        } catch (error) {
            console.error("Error fetching music data:", error);
            setError("Failed to fetch music data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    

    // const fetchSongsAndArtists = () => {
        // fetch(`http://localhost:8000/musicAPI/search?query=${query}`)
        //     .then((response) => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then((data) => {
        //         console.log('Data received:', data);
        //         setSongs(data.songs || []);
        //         setArtists(data.artists || []);
        //         setError(null);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching music data:', error);
        //         setError('Failed to fetch music data. Please try again later.');
        //     });

        // work with John to add route that returns an array of songs and artists (seperately)
        // break this down to two different fetch calls, one for each
    // };
    useEffect(() => {
        const storedQuery = localStorage.getItem("searchQuery");
        if (storedQuery) {
            fetchSongsAndArtists(storedQuery);
            localStorage.removeItem("searchQuery");  // Clear after fetching
        }
    }, []);
    
    // useEffect will fetch user data on page load
    useEffect(() => {
            fetch('http://localhost:8000/getUser')
                .then(res => res.json())
                .then(data => {   
                console.log(data);
                setCurrentUser({
                    email: data.email || '',
                    username: data.display_name || '',
                    image: data.image || '/spotify-logo.png'
                });
                setIsLoading(false);
                  // console.log("Email:", data.email);
            })
    }, []);

    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setQuery(event.target.value);
    // };

    const handleSearch = (query: string) => {
        fetchSongsAndArtists(query);
    };
    

    return (
        <div className="search-page">
            {/* Top Bar - User or Spotify Button */}
                {currentUser.email ? (
        
                    <User username={currentUser.username} image={currentUser.image} />
                ) : (
                    <div className="spotify-button-container">
                        <SpotifyButton title="Link Spotify" img="./SpotifyButton.png" />
                    </div>
                )}

            {/* Main Content */}
            <div className="search-page-container">
                {/* Left Section: Song List */}
                <div className="song-list-section">
                    <div className="song-list-section-top">
                        <RefreshButton />
                        <h2 className="song-list-section-title">"songs for a road trip"</h2>
                        <RefreshButton />
                    </div>
                    {/* make it work with the list of songs */}
                    {/* <SongList songs={songs}/> */}
                    <div className="scroll">
                    <SongList songs={songs} />

                    </div>
                </div>
                {/* Right Section: Popular Artists */}
                <div className="artist-section">
                    <h2 className="above-prompt">Not what you are looking for? Enter a new prompt.</h2>
                    <SearchBar onSearch={handleSearch} />
                    {/* <SearchBar onSearch={() => console.log('Search button clicked!')} /> */}
                        <h2 className="popular-artists-title">Popular Artists <span className="small-text">* based on your prompt</span></h2>
                        <div className="artist-grid">
                            {error ? (
                                <p className="error-text">{error}</p>
                            ) : artists.length === 0 ? (
                                <p className="empty-text">No artists found</p>
                            ) : (
                                artists.map((artist, index) => (
                                    <Artist
                                        key={index}
                                        name={artist.name}
                                        image={artist.image}
                                        genres={artist.genres}
                                        popularity={artist.popularity}
                                    />
                                ))
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
