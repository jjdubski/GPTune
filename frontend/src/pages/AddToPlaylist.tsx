import React, { useState, useEffect } from 'react';
import './AddToPlaylist.css';
import User from '../components/User/User'; // Ensure this path is correct
import Playlist from '../components/Playlist/Playlist'; // Ensure this path is correct
import AddSong from '../components/AddSong/AddSong'; // Ensure this path is correct
import SongList from '../components/SongList/SongList'; // Ensure this path is correct
import Song from '../components/Song/Song'; // Ensure this path is correct
interface Playlist {
    id: number;
    name: string;
    coverArt: string;
}

const AddToPlaylist: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch('http://localhost:8000/playlistAPI/playlists/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlaylists(data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setError('Failed to fetch playlists. Please try again later.');
            }
        };


        fetchPlaylists();
    }, []);
    
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [recommendations, setRecommendations] = useState<Song[]>([]);
    const handleSelectPlaylist = (playlistName: string) => {
        const selected = playlists.find((playlist) => playlist.name === playlistName);
        if (selected) {
          setSelectedPlaylist(selected);
          // Generate recommendations based on the selected playlist (using a placeholder here)
          const recommendations = [
            { title: "Recommended Song 1", artist: "Artist 1", album: "Album X", img: "image5_url" },
            { title: "Recommended Song 2", artist: "Artist 2", album: "Album Y", img: "image6_url" }
          ];
          setRecommendations(recommendations);
        }
      };
      const handleAddSong = (song: Song) => {
        if (selectedPlaylist) {
          // Update the selected playlist by adding the new song
          const updatedPlaylist = {
            ...selectedPlaylist,
            songs: [...selectedPlaylist.songs, song]
          };
    
          // Update the playlists state to reflect the new song in the selected playlist
          setPlaylists((prevPlaylists) =>
            prevPlaylists.map((playlist) =>
              playlist.name === selectedPlaylist.name ? updatedPlaylist : playlist
            )
          );
    
          // Remove the song from recommendations and add a new one
          const remainingRecommendations = recommendations.filter(
            (recommendation) => recommendation.title !== song.title
          );
    
          // Update the recommendations immediately after the song is added
          setRecommendations(remainingRecommendations);
    
          setTimeout(() => {
            // Find a new song to add (from allSongs, excluding the ones in the remainingRecommendations)
            const newSong = songs.find(
              (s) => !remainingRecommendations.some((r) => r.title === s.title)
            );
            if (newSong) {
              setRecommendations((prevRecommendations) => [
                ...prevRecommendations,
                newSong
              ]);
            }
          }, 500); // Delay for 0.5 seconds before adding a new recommendation
        }
      };
          
        
      
  const initialSongs = [
    { title: "Song 1", artist: "Artist 1", album: "Album 1", img: "image1_url" },
    { title: "Song 2", artist: "Artist 2", album: "Album 2", img: "image2_url" },
    { title: "Song 3", artist: "Artist 3", album: "Album 3", img: "image3_url" },
  ];
  useState(initialSongs);
    return (
        <div className="add-to-playlist-container">
                <div className="playlist-container">
                    <User username="John Doe" image="/path/to/user/image.jpg" /> {/* Adjust props as necessary */}


                    <h2 className="playlist-title">PLAYLISTS</h2>

                    <div className="playlist-page">
            <h2>Select a Playlist</h2>
            <div className="playlist-list">
                {playlists.map((playlist, index) => (
                <button
                    key={index}
                    onClick={() => handleSelectPlaylist(playlist.name)}
                    className={selectedPlaylist?.name === playlist.name ? "selected" : ""}
                >
                    {playlist.name}
                </button>
                ))}
            </div>
            </div> 



                {/* Render AddSong and SongList components */}
            {selectedPlaylist && (
            <div className="selected-playlist">
            <h3>Selected Playlist: {selectedPlaylist.name}</h3>
            <div className="song-list">
                {/* Render songs in the selected playlist */}
                {selectedPlaylist.songs.map((song, id) => (
                <div key={id} className="song-item">
                    <h4>{song.title}</h4>
                    <p>{song.artist} - {song.album}</p>
                    <img src={song.img} alt={song.title} />
                </div>
                ))}
            </div>
            </div>
        )}
        
        <h2>Add Songs:</h2>
        <div className="add-songs-container">
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
        </div>
        </div> 
        </div>
    );
};

export default AddToPlaylist;