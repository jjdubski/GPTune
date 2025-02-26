import React, { useState, useEffect } from 'react';
import './AddToPlaylist.css';
import { Navigate } from 'react-router-dom';
import User from '../components/User/User'; // Ensure this path is correct
// import Playlist from '../components/Playlist/Playlist'; // Ensure this path is correct
// import Song from '../components/Song/Song'; // Ensure this path is correct
// import SpotifyButton from '../components/SpotifyButton/SpotifyButton'; // Ensure this path is correct
import AddSong from '../components/AddSong/AddSong'; // Ensure this path is correct
import PlaylistList from '../components/PlaylistList/PlaylistList';

// interface Playlist {
//     id: number;
//     name: string;
//     coverArt: string;
// }

const AddToPlaylist: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = 
      useState<{email: string, username: string, image: string}>({email: '', username: '', image: ''});

    // const [playlists, setPlaylists] = useState<Playlist[]>([]);
    // const [error, setError] = useState<string | null>(null);
    // const [songs, setSongs] = useState<Song[]>([]);
    

    // useEffect(() => {
    //     const fetchPlaylists = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8000/playlistAPI/playlists/');
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setPlaylists(data);
    //         } catch (error) {
    //             console.error('Error fetching playlists:', error);
    //             setError('Failed to fetch playlists. Please try again later.');
    //         }
    //     };


    //     fetchPlaylists();
    // }, []);
    
  //   const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  //   const [recommendations, setRecommendations] = useState<Song[]>([]);
  //   const handleSelectPlaylist = (playlistName: string) => {
  //       const selected = playlists.find((playlist) => playlist.name === playlistName);
  //       if (selected) {
  //         setSelectedPlaylist(selected);
  //         // Generate recommendations based on the selected playlist (using a placeholder here)
  //         const recommendations = [
  //           { title: "Recommended Song 1", artist: "Artist 1", album: "Album X", img: "image5_url" },
  //           { title: "Recommended Song 2", artist: "Artist 2", album: "Album Y", img: "image6_url" }
  //         ];
  //         setRecommendations(recommendations);
  //       }
  //     };
  //     const handleAddSong = (song: Song) => {
  //       if (selectedPlaylist) {
  //         // Add the song to the selected playlist
  //         const updatedPlaylist = { ...selectedPlaylist, songs: [...selectedPlaylist.songs, song] };
    
  //         // Remove the song from recommendations and replace it with a new song
  //         const remainingRecommendations = recommendations.filter(
  //           (recommendation) => recommendation.title !== song.title
  //         );
    
  //         // Get a new song (one that isn't already in the recommendations list)
  //         setTimeout(() => {
  //           // Get a new song (one that isn't already in the recommendations list)
  //           const newSong = songs.find((s) => !remainingRecommendations.some((r) => r.title === s.title));
  //           if (newSong) {
  //             // Add the new song to recommendations after the delay
  //             setRecommendations((prevRecommendations) => [...prevRecommendations, newSong]);
  //           }
  //         }, 500); // Wait for 500ms (0.5 seconds)
    
  //         // Update the playlists state
  //         setPlaylists((prevPlaylists) =>
  //           prevPlaylists.map((playlist) =>
  //             playlist.name === selectedPlaylist.name ? updatedPlaylist : playlist
  //           )
  //         );
  //       }
  //     };
          
        
      
  // const initialSongs = [
  //   { title: "Song 1", artist: "Artist 1", album: "Album 1", img: "image1_url" },
  //   { title: "Song 2", artist: "Artist 2", album: "Album 2", img: "image2_url" },
  //   { title: "Song 3", artist: "Artist 3", album: "Album 3", img: "image3_url" },
  // ];
  // useState(initialSongs);

    useEffect(() => {
      fetch('http://localhost:8000')
        .then(res => res.json())
        .then(data => {   
          if (!data.user) {
            console.error('User data not found');
            window.location.href = 'http://localhost:8000/login';
            return;
          }else if (!data.user.email) {
            console.error('User email not found');
            window.location.href = 'http://localhost:8000/login';
            return;
          }
          setCurrentUser({
              email: data.user.email || '',
              username: data.user.display_name || '',
              image: data.user.image || '/spotify-logo.png'
          });
          setIsLoading(false);
            // console.log("Email:", data.user.email);
      })
    }, []);

    // const sendToLogin = () => {
    //   setRedirectToLogin(true);
    //   return <></>
    // }

    // if (redirectToLogin && !currentUser.email) {
    //   window.location.href = 'http://localhost:8000/login';
    // }

    // console.log(currentUser); // Log the currentUser object for debugging
    return (
      !isLoading ?
        <div className="playlist-container">
            <User username={currentUser.username} image={currentUser.image} />
            <h2 className="playlist-title">PLAYLISTS</h2>

            <div className="playlist-page">
      <h2>Select a Playlist</h2>
      <PlaylistList /> 
    </div> 



            {/* Render AddSong and SongList components */}
        {/* {selectedPlaylist && (
        <div className="selected-playlist">
          <h3>Selected Playlist: {selectedPlaylist.name}</h3>
          <div className="song-list">
            {selectedPlaylist.songs.map((song, id) => (
              <div key={id} className="song-item">
                <h4>{song.title}</h4>
                <p>{song.artist} - {song.album}</p>
                <img src={song.img} alt={song.title} />
              </div>
            ))} 
          </div>
        </div> */}
    
    <h2>Recommended Songs:</h2>
    {/* <div className="add-songs">
        {initialSongs.map((song, index) => (
          <AddSong
            key={index}
            title={song.title}
            artist={song.artist}
            album={song.album}
            img={song.img}
            onAdd={() => handleAddSong(song)} 
          />
        ))}
      </div> */}
    </div> :
        <div className="loading">
            <h2>Loading...</h2>
        </div>
    );
};

export default AddToPlaylist;