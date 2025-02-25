import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/SideMenu/SideMenu';
import './AddToPlaylist.css';

interface User {
    username: string;
}

const AddToPlaylist: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('spotifyUser');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            alert('You must be logged in to access this page.');
            navigate('/'); //home's file path
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('spotifyUser');
        setUser(null);
        navigate('/'); 
    };

    return (
        <div className="add-to-playlist-page">
            <div className="content">
                <h2>Add to Playlist</h2>
                <p>Pick a song, any song!</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default AddToPlaylist;
