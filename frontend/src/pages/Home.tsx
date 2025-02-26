import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import HomeTile from '../components/HomeTile/HomeTile';
import User from '../components/User/User';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SearchBar from '../components/SearchBar/SearchBar';
import './Home.css';

const Home: React.FC = () => {
    const [response, setResponse] = useState('');
    const [currentUser, setCurrentUser] = useState<{ email: string, username: string, image: string }>({ email: '', username: '', image: '' });

    const handleGenerateResponse = async () => {
        const requestData = {
            prompt: 'give me a random color',
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
    function findSongs(query: string) {
        // console.log(query);
        window.location.href = `/search`;
        // jake needs to fix this
        // const generateResponse = async () =>{
        //     const requestData = {
        //         prompt: query,
        //         num_runs: 1
        //     };
        //     try {
        //         const res = await fetch('http://127.0.0.1:8000/generate_response/', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(requestData)
        //         });
    
        //         const data = await res.json();
        //         if (res.ok) {
        //             setResponse(data.response);
        //         } else {
        //             console.error('Error:', data.error);
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // }
    }

    
    useEffect(() => {
        fetch('http://localhost:8000').then(res => res.json()).then(data => {
            setCurrentUser({
                email: data.user.email || '',
                username: data.user.display_name || '',
                image: data.user.image || '/spotify-logo.png'
            });
            console.log(data);
        });
        handleGenerateResponse();
    }, []);

    return (
        <div className="home-container">
            <SearchBar onSearch={findSongs}/>
            <div>
                {currentUser.email ? (
                    <User username={currentUser.username} image={currentUser.image} />
                ) : (
                    <div className="spotify-button-container">
                        <SpotifyButton
                            title="Link Spotify"
                            img="./SpotifyButton.png"
                        />
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
                <div>
                    <h3>Generated Response:</h3>
                    <p>{response}</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
