import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeTile from '../components/HomeTile/HomeTile';
import User from '../components/User/User';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SearchBar from '../components/SearchBar/SearchBar';
import './Home.css';

const Home: React.FC = () => {  // The function starts here

    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<{ email: string, username: string, image: string }>({
        email: '',
        username: '',
        image: ''
    });

    function findSongs(query: string) {
        localStorage.setItem("searchQuery", query);  // Store query for later use
        window.location.href = `/search`;
    }

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

    // ✅ Make sure this return is INSIDE the component function
    return (
        !isLoading ? (
            <div className="home-container">
                <SearchBar onSearch={findSongs} />
                {currentUser.email ? (
                    <User username={currentUser.username} image={currentUser.image} />
                ) : (
                    <div className="spotify-button-container">
                        <SpotifyButton title="Link Spotify" img="./SpotifyButton.png" />
                    </div>
                )}
                <div className="music-home-container">
                    <Link to="/discover">
                        <HomeTile title="Discover" img="/Discover.png" />
                    </Link>
                    <Link to="/add-to-playlist">
                        <HomeTile title="Add to Playlist" img="./AddtoPlaylist.png" />
                    </Link>
                    <Link to="/this-or-that">
                        <HomeTile title="This or That?" img="./ThisorThat.png" />
                    </Link>
                </div>
            </div>
        ) : (
            <></>  // Loading state
        )
    );
};

export default Home;  // ✅ The function should end before this line
