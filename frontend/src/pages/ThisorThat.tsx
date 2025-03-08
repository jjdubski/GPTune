import React from 'react';
import SongSelector from '../components/SongSelector/SongSelector'; // Adjust the path if necessary

const ThisorThat: React.FC = () => {
    const song = {
        title: "Song Title",
        artist: "Artist Name",
        image: "https://via.placeholder.com/150", // Replace with actual image URL
        spotifyUrl: "https://open.spotify.com" // Replace with actual Spotify URL
    };

    return (
        <div>
            <h1>This or That</h1>
            <SongSelector 
                title={song.title} 
                artist={song.artist} 
                image={song.image} 
                spotifyUrl={song.spotifyUrl} 
            />
        </div>
    );
};

export default ThisorThat;