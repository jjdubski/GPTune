import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeTile from '../components/HomeTile/HomeTile';
import User from '../components/User/User';
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import SearchBar from '../components/SearchBar/SearchBar';
import './Home.css';

// interface HomeProps {
//   currentDate: number
//   currentTime: number
// }

// const Home: React.FC<HomeProps> = ({ currentDate, currentTime }) => {
const Home: React.FC = () => {
    // const [currentTime, setCurrentTime] = useState('')
    // const [currentDate, setCurrentDate] = useState('')
    // const [response, setResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = 
        useState<{email: string, username: string, image: string}>({email: '', username: '', image: ''});

    // console.log(currentUser)

    // Fetches date and time from backend on load/reload
    // useEffect(() => {
    //   fetch('http://localhost:8000').then(res => res.json()).then(data => {
    //     setCurrentTime(data.current_time)
    //     setCurrentDate(data.current_date)
    //   })
    // }

    // Updates date and time every second
    // useEffect(() => {
    //     const fetchData = () => {
    //         fetch('http://127.0.0.1:8000').then(res => res.json()).then(data => {
    //             setCurrentTime(data.current_time)
    //             setCurrentDate(data.current_date)
    //             setCurrentUser({ email: data.user.email })
    //         })
    //     }

    //     fetchData()
    //     const interval = setInterval(fetchData, 1000)
    //     return () => clearInterval(interval)
    // }
    // ,[])

    // const handleGenerateResponse = async () => {
    //     return // to stop prompting for now
    //     const requestData = {
    //         prompt: 'give me a song to listen on a long drive',
    //         num_runs: 5
    //     };
    //     try {
    //         const res = await fetch('http://127.0.0.1:8000/getRecommendations/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(requestData)
    //         });

    //         const data = await res.json();
    //         if (res.ok) {
    //             // var output = "";
    //             // output+= data.response.title 
    //             // output+= data.response.artist
    //             // output+= data.response.album
    //             setResponse(data.response);
    //         } else {
    //             console.error('Error:', data.error);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };
    function findSongs(query: string) {
        // console.log(query);
        window.location.href = `/search`;
        return query
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
            console.log("User:", data);
            setIsLoading(false);
        });
        // handleGenerateResponse();
    }, []);

    return (
        !isLoading ?  (
        <div className="home-container">
            <SearchBar onSearch={findSongs}/>
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
                {/* <div>
                    <h3>Generated Response:</h3>
                    <p>{response}</p>
                </div> */}
                {/* <p>The date is  {currentDate} and the time is {currentTime}.</p> */}
                {/* <p>Logged in as: {currentUser.email}</p> */}
            </div> ) :
                <></>
    );
};

export default Home;
