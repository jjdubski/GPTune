import React, { useState, useEffect, useRef } from 'react';
import SongSelector from '../components/SongSelector/SongSelector';
import SongCard from '../components/SongCard/SongCard';
import './ThisorThat.css';
import LikedSongList from '../components/LikedSongList/LikedSongList';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    uri: string;
}

const ThisorThat: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
    const [selectedPlaylistID, setSelectedPlaylistID] = useState<string | null>("liked_songs");
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasFetchedSongs = useRef(false);
    const hasFetchedSong = useRef(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [prevSongs, setPrevSongs] = useState<Record<number, { song: Song; liked: boolean }>>({});
    const [isOpen, setIsOpen] = useState(false);

    // checks if user is logged in, redirects to login page if not
    useEffect(() => {
        fetch('http://localhost:8000')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || !data.user.email) {
                    window.location.href ="http://127.0.0.1:8000/login/"; // Redirect to login page
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if(hasFetchedSong.current){
            return;
        }
        generateSong();
        hasFetchedSong.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!selectedPlaylistID) {
                return;
            }
            try {
                const response = await fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/${selectedPlaylistID}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlaylistSongs(Array.isArray(data) ? data : []);
                setCurrentIndex(0);
            } catch (error) {
                console.error('Error fetching Playlist songs:', error);
            }
            hasFetchedSongs.current = false;
        };

        fetchPlaylists();
    }, [selectedPlaylistID]);

    const generateSong = async (updatedPrevSongs?: Record<number, { song: Song; liked: boolean }>) => {
        try {
            const prompt = selectedSong 
                ? `give me one more song similar to ${selectedSong.title} by ${selectedSong.artist} but don't recommend ${updatedPrevSongs && Object.values(updatedPrevSongs).map(entry => entry.song.title).join(", ")}`
                : playlistSongs.length > 0 
                ? `give me one more song similar to ${playlistSongs.map(song => song.title).join(", ")} but don't recommend ${updatedPrevSongs && Object.values(updatedPrevSongs).map(entry => entry.song.title).join(", ")}`
                : `give me a popular song`; // on first load, playlistSongs is empty

            const response = await fetch('http://localhost:8000/playlistAPI/generateSong/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    num_runs: 1
                })
            });

            const data = await response.json();
            if (response.ok) {
                const newSong: Song = {
                    trackID: data.trackID,
                    title: data.title,
                    artist: data.artist,
                    album: data.album,
                    image: data.image,
                    uri: data.uri
                };
               // Check if the song is already in prevSongs
                if (updatedPrevSongs && Object.values(updatedPrevSongs).some(entry => entry.song.trackID === newSong.trackID)) {
                    console.log(`Song "${newSong.trackID}" is already in prevSongs. Reprompting...`);
                    generateSong(updatedPrevSongs); // Reprompt for a new song
                } else {
                    setCurrentSong(newSong);
                }
            } else {
                console.error('Error:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // const handleSelectPlaylist = (playlistID: string) => {
    //     setPlaylistSongs([]);
    //     setSelectedPlaylistID(playlistID);
    //     setCurrentIndex(0);
    // };

    const handleAddToPlaylist = () => {
        if (currentSong) {
            setPrevSongs((prev) => {
            const updatedSongs = {
                ...prev,
                [currentIndex]: { song: currentSong, liked: true },
            };
            generateSong(updatedSongs); // Call generateSong here after updating prevSongs
            setPlaylistSongs((prevSongs) => [currentSong, ...prevSongs]);
            addToPlaylist(); // Add the song to the playlist
            return updatedSongs;
            });
            setCurrentIndex(currentIndex + 1);
        }
    }


    const addToPlaylist = async() => {;
        try {
            const response = await fetch("http://localhost:8000/playlistAPI/addSongToPlaylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    trackID: currentSong?.trackID, // Sending trackID as the 'uri' cuz thats what backend expects. Spotipy can take ether
                    playlistID: selectedPlaylistID  // Sending playlistID in the expected structure
                }),
            });

            if (response.ok) {
                console.log(`Song ${currentSong?.trackID} added successfully.`);
                                // showPopup("Song added to playlist!", "success");
                // setPlaylistSongs([...playlistSongs, { trackID, title: "Unknown", artist: "Unknown", album: "Unknown", image: "", uri: "" }]); // Temporary UI update
            } else {
                console.error("Failed to add song:", await response.text());
                // const errorMessage = await response.text();
                // showPopup(`Failed to add song: ${errorMessage}`, "error");
            }
        } catch (error) {
            console.error("Error adding song:", error);
            // showPopup("Error adding song. Please try again.", "error");
        }
    };

    const dislikeSong = () => {
        if (currentSong) {
            setPrevSongs((prev) => {
                const updatedSongs = {
                    ...prev,
                    [currentIndex]: { song: currentSong, liked: false },
                };
                generateSong(updatedSongs); // Call generateSong here after updating prevSongs
                return updatedSongs;
            });
            setCurrentIndex(currentIndex + 1);
        }
    };

    // const handleNextSong = async () => {
    //     // setCurrentIndex((prevIndex) => (prevIndex + 1) % playlistSongs.length);
    //     generateSong();  
    // };  

    // const handlePrevSong = () => {
    //     setCurrentIndex((prevIndex) => {
    //         if (prevIndex > 0) {
    //             const newIndex = prevIndex - 1;
    //             setCurrentSong(prevSongs[newIndex]); // Update to the previous song
    //             return newIndex;
    //         } else {
    //             console.log("No previous song available.");
    //             return 0; // Keep at 0 if no previous songs
    //         }
    //     });
    // };

    // const handleUndoAction = () => {
    //     // if (prevSongs.length > 0) {
    //     //     const newPrevSongs = [...prevSongs];
    //     //     const lastSong = newPrevSongs.pop();
    //     //     setCurrentSong(lastSong || null);
    //     //     setPrevSongs(newPrevSongs);
    //     // }
    //     setCurrentIndex(currentIndex - 1);
    //     const songAtCurrentIndex = Object.values(prevSongs).find(
    //         (value) => value.song.trackID === currentSong?.trackID
    //     );
    //     console.log(songAtCurrentIndex);
    //     if (songAtCurrentIndex) {
    //         const { song, liked } = songAtCurrentIndex;
    //         setPrevSongs((prev) => {
    //             const newPrevSongs = { ...prev };
    //             delete newPrevSongs[song.trackID];
    //             return newPrevSongs;
    //         });
    //         if (liked) {
    //             setPlaylistSongs((prevSongs) => prevSongs.filter((s) => s.trackID !== song.trackID));
    //         }
    //     }
        
    // };

    const handleSelectSong = (song: Song) => {
        console.log("Selected song:", song);
        setSelectedSong(song);
        generateSong();
    };

    const handleOpen = (open: boolean) => {
        setIsOpen(open); // Update the isOpen state
    };
    

    return (
        isLoading ? (
            //an idea maybe to add a loading gif
            // <div className="loading">
            //     <img src="/loading.gif" alt="Loading" />
            // </div>
            <></>
        ) : (
        <div className="this-or-that-page">
            <LikedSongList songs={playlistSongs} isOpen={isOpen} handleOpen={handleOpen} onSelectSong={handleSelectSong}/>
            {/* <button className="arrow-button" onClick={() => console.log("")}>
                <img src="/arrow.png" alt="Arrow" className="arrow-icon" /> */}
            <div className="this-or-that-container">
                <div className="this-or-that-content">
                    <div className ="song-selector-container">
                        {selectedSong ? (
                            <h1>Showing Songs Like:</h1>
                        ) : (
                            <h1>Select a song:</h1>
                        )}
                        <SongSelector
                            title={selectedSong?.title || "No Songs"}
                            artist={selectedSong?.artist || ""}
                            image={selectedSong?.image || ""}
                            spotifyUrl={selectedSong?.uri || ""}
                            // songs={playlistSongs}
                            // onSelectSong={handleSelectSong}
                            isOpen={isOpen}
                            handleOpen={handleOpen}
                            // onEditClick= {setOpen}
                        />  
                        {/* <button className="arrow-button" onClick={handleUndoAction}>
                            <img src="/arrow.png" alt="Arrow" className="arrow-icon" />
                        </button> */}
                    </div>

                    {playlistSongs.length > 0 && (
                    <> 
                        <div className="song-card-container">
                            <SongCard
                                title={currentSong?.title || "No Songs"}
                                artist={currentSong?.artist || ""}
                                album={currentSong?.album  || ""}
                                image={currentSong?.image || ""}
                                uri = {currentSong?.uri || ""}
                            />
                            {/* 
                            <div className="action-buttons">
                                <button className="exit-btn" onClick={generateSong}>
                                    <img src="/exit.png" alt="Exit" />
                                </button>
                                <button className="check-btn" onClick={addToPlaylist}>
                                    <img src="/check.png" alt="Check" /> */}
                                {/* </button> */}
                            <div className="action-buttons">
                                <button className="trash-btn" onClick={dislikeSong}>
                                    {/* <i className="trash"></i> */}
                                    <img src="/trash-btn.png" alt="trash" />
                                </button>

                                <button className="heart-btn" onClick={handleAddToPlaylist}>
                                    <img src="/heart-btn.png" alt="heart" />
                                </button>
                            </div>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </div>
        )
    );
}

export default ThisorThat;
