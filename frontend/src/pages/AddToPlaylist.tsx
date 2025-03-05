import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AddToPlaylist.css';
import AddSong from '../components/AddSong/AddSong';
import PlaylistList from '../components/PlaylistList/PlaylistList';
import Song from '../components/Song/Song';
import RefreshButton from '../components/RefreshButton/RefreshButton';
import Playlist from '../components/Playlist/Playlist';

interface Song {
    trackID: string;
    title: string;
    artist: string;
    album: string;
    image: string;
    uri: string
}

interface Playlist {
    playlistID: string;
    name: string;
    image: string;
}


const AddToPlaylist: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [songID, setSongID] = useState('');
    const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    const [selectedPlaylistID, setSelectedPlaylistID] = useState<string | null>(null);
    const hasFetchedSongs = useRef(false);

    useEffect(() => {
        fetch('http://localhost:8000')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || !data.user.email) {
                    window.location.href ="http://127.0.0.1:8000/login/"; // Redirect to login page
                }
            })
    }, []);
    const generateSongs = useCallback(async () => {
        if (hasFetchedSongs.current) return; //should be good
        const requestData = {
            prompt: `give me songs similar to ${playlistSongs.map(song => song.title).join(", ")}`,
            num_runs: 5,
            userInfo: "False"
        };
        console.log("requestData:",requestData);
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
                const songList: Song[] = Object.values(data.songs as { trackID: string; title: string; artist: string; album: string; image: string; uri:string }[]).map((item) => ({
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
            hasFetchedSongs.current = false;
        }
        
        fetchPlaylists();
    }, [selectedPlaylistID]);

    useEffect(() => {
        // return
        const addSong = async () => {
            const requestData = {
                // playlist: selectedPlaylist,
                song: songID,
                playlist: selectedPlaylistID,
            };
            console.log("addsongdata",requestData);
            try {
                const response = await fetch("http://localhost:8000/playlistAPI/addSongToPlaylist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
                });
        
                if (response.ok) {
                // console.log("Song added successfully to", selectedPlaylist);
                
                } else {
                console.error("Failed to add song to playlist:", response);
                }
            } catch (error) {
                console.error("Error adding song:", error);
            } 
        }
        addSong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [songID])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/getUser')
            .then(res => res.json())
            .then(data => {
            console.log(data);
            if (data.error) {
                console.error('User email not found');
                window.location.href = 'http://127.0.0.1:8000/login';
                return;
            }
            
            setIsLoading(false);
              // console.log("Email:", data.email);
        })
    }, []);

    useEffect(() => {
        if (playlistSongs.length > 0) {
            generateSongs();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistSongs]);


    const handleSelectPlaylist = (playlistID: string) => {
        setSelectedPlaylistID(playlistID);
        setPlaylistSongs([]); // Reset songs when switching playlists
        hasFetchedSongs.current = false; // Allow new recommendations to be fetched
    };

    const handleAddSong = async (trackID: string) => {
        if (playlistSongs.some(song => song.trackID === trackID)) {
            console.log("Song already in playlist.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8000/playlistAPI/addSongToPlaylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    song: { uri: trackID },  // Sending trackID as the 'uri' cuz thats what backend expects. Spotipy can take ether
                    playlist: { playlistID: selectedPlaylistID }  // Sending playlistID in the expected structure
                }),
            });
    
            if (response.ok) {
                console.log(`Song ${trackID} added successfully.`);
                setSongID(trackID);
                setPlaylistSongs([...playlistSongs, { trackID, title: "Unknown", artist: "Unknown", album: "Unknown", image: "", uri: "" }]); // Temporary UI update
                hasFetchedSongs.current = false; // Allow new recommendations
                generateSongs(); // Fetch new recommendations
            } else {
                console.error("Failed to add song:", await response.text());
            }
        } catch (error) {
            console.error("Error adding song:", error);
        }
    };

    

    const handleRefresh = () => {
        hasFetchedSongs.current = false;  // Set hasFetched to false
        generateSongs();  // Call your generateSongs function
      };

    return (
        isLoading ? (
            <></>
        ) : (
            <div className="add-to-playlist-container">
                <div className="playlist-section">
                    <h1 className="playlist-section-title">Select Playlist</h1>
                    <div className="scroll">
                        <PlaylistList onSelectPlaylist={handleSelectPlaylist}/>
                    </div>
                </div>
                <div className="add-songs-container">
                    <div className="add-songs-header">
                        <h1 className="add-songs-title">Recommended Songs</h1>
                        <RefreshButton onRefresh={handleRefresh} />
                    </div>
                    <div className="scroll">
                        {recommendedSongs.length > 0 ? (
                            recommendedSongs.map((song, index) => {
                                if (!song.trackID) {
                                    console.error(`Skipping invalid song at index ${index}:`, song);
                                    return null; // Skip rendering if song is invalid
                                }
                                return <AddSong key={song.trackID} song={song} onAddSong={handleAddSong}/>
                        })
                            
                        ) : selectedPlaylistID ? (
                            <p>Loading recommendations...</p>
                        ) : (
                            <p>Please select a playlist on the left for recommendations.</p>
                        )} 
                    </div>
                </div>
            </div>
        )
    );
};

export default AddToPlaylist;
