import React from "react";
import "./SpotifyButton.css";

interface SpotifyButtonProps {
    title: string;
    img: string;
}

const SpotifyButton: React.FC<SpotifyButtonProps> = ({ title, img  }) => {
    const handleClick = () => {
        console.log(`${title} button clicked!`);
    };

    return (
        <button onClick={() => window.location.href="http://127.0.0.1:8000/login/"} className="spotify-button">
            <span>Link to Spotify</span>
            <img src="./Spotify.png" alt="Link to Spotify" className="spotify-icon" />
        </button>
    );
};

export default SpotifyButton;
