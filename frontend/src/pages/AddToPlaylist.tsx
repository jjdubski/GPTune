import React, { useState, useEffect } from 'react';
import './AddToPlaylist.css';
import User from '../components/User/User'; // Ensure this path is correct
import SpotifyButton from '../components/SpotifyButton/SpotifyButton';
import AddSong from '../components/AddSong/AddSong';
import PlaylistList from '../components/PlaylistList/PlaylistList';
import RecommendedSongList from '../components/RecommendedSongList/RecommendedSongList';
import Song from '../components/Song/Song';

// interface Playlist {
//     id: number;
//     name: string;
//     coverArt: string;
// }

const failSafe = [
  {
      id: 1,
      name: "Chill Vibes",
      coverArt: "https://via.placeholder.com/150"
  },
  {
      id: 2,
      name: "Workout Mix",
      coverArt: "https://via.placeholder.com/150"
  },
  {
      id: 3, 
      name: "Top Hits",
      coverArt: "https://via.placeholder.com/150"
  },
  {
      id: 4,
      name: "Lo-Fi Beats",
      coverArt: "https://via.placeholder.com/150"
  },
  {
      id: 5,
      name: "Indie Anthems",
      coverArt: "https://via.placeholder.com/150"
  }
];

interface Song {
    title: string;
    artist: string;
    album: string;
    image: string;
}

// const AddToPlaylist = () => {
//     const [songs, setSongs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch("http://127.0.0.1:8000/generate_response/", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("API Response:", data);  // Debugging line
//                 if (data.recommendations) {
//                     setSongs(data.recommendations);
//                 } else {
//                     setSongs([]);
//                 }
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 console.error("Error fetching recommendations:", error);
//                 setLoading(false);
//             });
//     }, []);

const AddToPlaylist: React.FC = () => {
    // const currentUser = {
    //     username: 'Guest',
    //     email: '',
    //     image: 'defaultImage.png'
    // };
    const [currentUser, setCurrentUser] = useState<{ email: string; username: string; image: string }>({
        email: '',
        username: '',
        image: '/spotify-logo.png'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [song, setSong] = useState<Song>({
        title: '',
        artist: '',
        album: '',
        img: ''
    });

    useEffect(() => {
        fetch('http://localhost:8000/getUser')
            .then(res => res.json())
            .then(data => {   
            console.log(data);
            if (data.email === '') {
                console.error('User email not found');
                window.location.href = 'http://localhost:8000/login';
                return;
            }
            setCurrentUser({
                email: data.email || '',
                username: data.display_name || '',
                image: data.image || '/spotify-logo.png'
            });
            setIsLoading(false);
              // console.log("Email:", data.email);
        })
    }, []);

    return (
//         <div>
//             <h2>Recommended Songs</h2>
//             {loading ? (
//                 <p>Loading recommendations...</p>
//             ) : (
//                 <ul>
//                     {songs.length > 0 ? (
//                         songs.map((song, index) => (
//                             <li key={index}>
//                                 <strong>Title:</strong> {song.title} <br />
//                                 <strong>Artist:</strong> {song.artist} <br />
//                                 <strong>Album:</strong> {song.album}
//                             </li>
//                         ))
//                     ) : (
//                         <p>No recommendations available.</p>
//                     )}
//                 </ul>
//             )}
//         </div>
        
        isLoading ? (
          <></>
        ) : (
        <div className="add-to-playlist-container">
            <div className="playlist-section">
                <h1 className="section-title">Select Playlist</h1>
                <div className="scroll">
                    <PlaylistList />
                </div>
            </div>
            <div className="add-songs-container">
                {/* Add your song data here */}
                <AddSong song={song}/>
                {/* <RecommendedSongList  />  */}
            </div>
        </div>
        )
    );
};

export default AddToPlaylist;