import React, { useEffect, useState } from 'react';
import './Artist.css';

interface Artist {
    id: number;
    name: string;
    image: string;
}

const ArtistList: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/artistAPI/artists/?format=json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                setArtists(data);
            })
            .catch(error => console.error("Error fetching artists:", error));
    }, []);

    return (
        <div className="artist-list">
            {artists.map((artist) => (
                <div key={artist.id} className="artist-card">
                    <img src={artist.image} alt={artist.name} className="artist-image" />
                    <p className="artist-name">{artist.name}</p>
                </div>
            ))}
        </div>
    );
};

export default ArtistList;
