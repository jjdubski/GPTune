import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AddToPlaylist.css';
import AddSong from '../components/AddSong/AddSong';
import PlaylistList from '../components/PlaylistList/PlaylistList';
import Song from '../components/Song/Song';
import RefreshButton from '../components/RefreshButton/RefreshButton';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    uri: string
}

// interface Playlist {
//     playlistID: string;
//     name: string;
//     image: string;
// }


const AddToPlaylist: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    const [selectedPlaylistID, setSelectedPlaylistID] = useState<string>('');
    const [selectedSongID, setSelectedSongID] = useState<string>('');
    const hasFetchedSongs = useRef(false);
    const [popupMessage, setPopupMessage] = useState<string | null>(null);
    const [popupType, setPopupType] = useState<'success' | 'error' | null>(null);

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
    
        // Function to show messages
        const showPopup = (message: string, type: 'success' | 'error') => {
            setPopupMessage(message);
            setPopupType(type);
            
            // Auto-hide message after 3 seconds
            setTimeout(() => {
                setPopupMessage(null);
                setPopupType(null);
            }, 3000);
        };

    // Fetches recommended songs based on selected playlist songs 
    const generateSongs = useCallback(async () => {
        if (hasFetchedSongs.current) return; //should be good
        const requestData = {
            prompt: `give me songs similar to ${playlistSongs.map(song => song.title).join(", ")}`,
            num_runs: 5,
            userInfo: "False",
            songsInPlaylist: playlistSongs.map(song => song.trackID)
        };
        console.log("requestData:",requestData);
        console.log("playlistSongs:",playlistSongs);
        try {
            const res = await fetch('http://127.0.0.1:8000/getRecommendations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
    
            const data = await res.json();
            if (res.ok) {
                const songList: Song[] = Object.values(data.songs as { 
                        trackID: string; 
                        title: string; 
                        artist: string;
                        album: string; 
                        image: string; 
                        uri:string;
                    }[]).map((item) => ({
                        trackID: item.trackID,
                        title: item.title,
                        artist: item.artist,
                        album: item.album,
                        image: item.image,
                        uri: item.uri
                }));
                
                setRecommendedSongs(songList);
            } else {
                console.error('Error:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        hasFetchedSongs.current = true;
    }, [playlistSongs]);

    // Fetches songs from selected playlist
    useEffect(() => {
        const fetchPlaylists = async () => {
            if(!selectedPlaylistID){
                return
            }
            try {
                const response = await fetch(`http://localhost:8000/playlistAPI/getPlaylistSongs/${selectedPlaylistID}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPlaylistSongs(Array.isArray(data) ? data : []);
            }
            catch (error) {
                console.error('Error fetching Playlist songs:', error);
            }
            hasFetchedSongs.current = false; // Allow new recommendations
        }
        
        fetchPlaylists();
    }, [selectedPlaylistID]);

    // if playlistSongs changes (and its greater than 0) generate new recommendations
    useEffect(() => {
        if (playlistSongs.length > 0) {
            generateSongs();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistSongs]);


    // Updates selectedPlaylistID and resets songs
    const handleSelectPlaylist = (playlistID: string) => {
        setPlaylistSongs([]); // Reset songs when switching playlists
        setRecommendedSongs([]);
        setSelectedPlaylistID(playlistID);
    };

    const handleAddSong = async (trackID: string) => {
        if (playlistSongs.some(song => song.trackID === trackID)) {
            console.log("Song already in playlist.");
            return;
        }

        // Remove the song from the recommended songs list
        setRecommendedSongs(prevSongs => prevSongs.filter(song => song.trackID !== trackID));

        const addSong = async () => {
            try {
                const response = await fetch("http://localhost:8000/playlistAPI/addSongToPlaylist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        trackID: trackID,  // Sending trackID as the 'uri' cuz thats what backend expects. Spotipy can take ether
                        playlistID: selectedPlaylistID  // Sending playlistID in the expected structure
                    }),
                });

                if (response.ok) {
                    console.log(`Song ${trackID} added successfully.`);
                                    showPopup("Song added to playlist!", "success");
                    // setPlaylistSongs([...playlistSongs, { trackID, title: "Unknown", artist: "Unknown", album: "Unknown", image: "", uri: "" }]); // Temporary UI update
                } else {
                    console.error("Failed to add song:", await response.text());
                    const errorMessage = await response.text();
                    showPopup(`Failed to add song: ${errorMessage}`, "error");
                }
            } catch (error) {
                console.error("Error adding song:", error);
                showPopup("Error adding song. Please try again.", "error");
            }

            // Generate a new song recommendation
            try {
                const res = await fetch('http://127.0.0.1:8000/playlistAPI/generateSong/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: `give me one more song similar to ${playlistSongs.map(song => song.title).join(", ")}`,
                        num_runs: 1,
                        userInfo: "False"
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    const newSong: Song = {
                        trackID: data.trackID,
                        title: data.title,
                        artist: data.artist,
                        album: data.album,
                        image: data.image,
                        uri: data.uri
                    };
                    setRecommendedSongs(prevSongs => [...prevSongs, newSong]);
                } else {
                    console.error('Error:', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        addSong();
    };

    // Fetches new recommendations when refresh button is clicked
    const handleRefresh = () => {
        console.log("Refesh Button Clicked")
        hasFetchedSongs.current = false;  // Set hasFetched to false
        setRecommendedSongs([])
        generateSongs();  // Call your generateSongs function
        setSelectedPlaylistID('loading');
        setSelectedSongID('');  // Reset selected song
    };
    return (
        isLoading ? (
            <></>
        ) : (
            <div className="add-to-playlist-container">
                {popupMessage && (
                <div className={`popup-message ${popupType}`}>
                    {popupMessage}
                </div>
                )}
                <div className="playlist-section">
                    <h1 className="playlist-section-title">Select Playlist</h1>
                    <div className="scroll">
                        <PlaylistList 
                            onSelectPlaylist={handleSelectPlaylist} 
                            selectedPlaylistID={selectedPlaylistID} 
                            // highlightSelected={true} // Pass a prop to highlight the selected playlist
                        />
                    </div>
                </div>
                <div className="add-songs-container">
                    <div className="add-songs-header">
                        <h1 className="add-songs-title">Recommended Songs</h1>
                        {/* <script>console.log("Selected PlaylistID: ", selectedPlaylistID)</script>  */}
                        {selectedPlaylistID && <RefreshButton onRefresh={handleRefresh} />}
                    </div>
                    <div className="scroll">
                        {recommendedSongs.length > 0 ? (
                            recommendedSongs.map((song, index) => {
                                if (!song.trackID) {
                                    console.error(`Skipping invalid song at index ${index}:`, song);
                                    return null; // Skip rendering if song is invalid
                                }
                                return (
                                    <AddSong 
                                        key={song.trackID} 
                                        song={song} 
                                        onAddSong={handleAddSong} 
                                        selectedSongID={selectedSongID}
                                    />
                                );  
                        })
                            
                        ) : (
                            <p>
                                {selectedPlaylistID 
                                    ? 'Loading recommendations...' 
                                    : 'Please select a playlist on the left for recommendations.'
                                }
                            </p>
                        )} 
                    </div>
                </div>
            </div>
        )
    );
};

export default AddToPlaylist;
