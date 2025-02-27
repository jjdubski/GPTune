import React from 'react';
import './AddToPlaylist.css';
import { useEffect, useState } from "react";

//const AddToPlaylist: React.FC = () => {
    // const [user, setUser] = useState<User | null>(null);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const storedUser = localStorage.getItem('spotifyUser');
    //     if (storedUser) {
    //         setUser(JSON.parse(storedUser));
    //     } else {
    //         alert('You must be logged in to access this page.');
    //         navigate('/'); //home's file path
    //     }
    // }, [navigate]);

    // const handleLogout = () => {
    //     localStorage.removeItem('spotifyUser');
    //     setUser(null);
    //     navigate('/'); 
    // };

//    // return (
//         <div className="add-to-playlist-page">
//             <h1>Add to Playlist</h1>
//         </div>
//     );
// ;

// export default AddToPlaylist;
// import { useState } from "react";
interface Song {
    title: string;
    artist: string;
    album: string;
}

const AddToPlaylist = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/generate_response/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("API Response:", data);  // Debugging line
                if (data.recommendations) {
                    setSongs(data.recommendations);
                } else {
                    setSongs([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching recommendations:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Recommended Songs</h2>
            {loading ? (
                <p>Loading recommendations...</p>
            ) : (
                <ul>
                    {songs.length > 0 ? (
                        songs.map((song, index) => (
                            <li key={index}>
                                <strong>Title:</strong> {song.title} <br />
                                <strong>Artist:</strong> {song.artist} <br />
                                <strong>Album:</strong> {song.album}
                            </li>
                        ))
                    ) : (
                        <p>No recommendations available.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default AddToPlaylist;