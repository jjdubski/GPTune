import React from 'react';
import './Song.css';

interface SongProps {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    uri: string; 
}

const Song: React.FC<SongProps> = ({ title, artist, album, image, uri}) => {
    
    const changeSong = async () => {
        const requestData = {
            uri: uri,
        };
        console.log("Changing song to:", uri);
        try {
        await fetch("http://localhost:8000/songAPI/playSong/", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });
        } catch (error) {
        console.error("Error changing song:", error);
        }
    };
            
            // const data = await res.json();
            // if (res.ok) {
            //     console.log('Song changed:', data);
            // } else {
            //     console.error('Error:', data.error);
            // }
                
                // then(response => {
                //     if (!response.ok) {
                //         throw new Error('Network response was not ok');
                //     }
                //     return response.json()
                // })
                // .then(data => {
                //     console.log('Data received:', data)
                // })
                // .catch(error => {
                //     console.error('Error changing song:', error)
                // })

    //     } 
    //     catch (error) {
    //         console.error('Error changing song:', error);
    //     }
    // }
    return (
        <div className='song' onClick={changeSong}>
            <img className="song-image" src={image} alt={`${title} album cover`} />

            <div className='song-info'>
                <p className='song-title'>{title}</p>
                <p className='song-artist'>{artist}</p>
                <p className='song-album'>{album}</p>

            </div>
            {/* <button className="play-button" onClick={() => onPlay(uri)}></button> Play button */}
        </div>
    );
};

export default Song;
