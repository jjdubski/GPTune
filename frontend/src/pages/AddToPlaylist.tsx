import React from 'react';
import './AddToPlaylist.css';

const AddToPlaylist: React.FC = () => {
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

    return (
        <div className="add-to-playlist-page">
            <h1>Add to Playlist</h1>
        </div>
    );
};

export default AddToPlaylist;
