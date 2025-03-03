import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import './AddToPlaylist.css';
import AddSong from '../components/AddSong/AddSong';
import PlaylistList from '../components/PlaylistList/PlaylistList';
import Song from '../components/Song/Song';
import RefreshButton from '../components/RefreshIcon/RefreshIcon';

interface Song {
    title: string;
    artist: string;
    album: string;
    image: string;
}

interface Playlist {
    playlistID: string;
    name: string;
    image: string;
}

const AddToPlaylist: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
    const [selectedPlaylistID, setSelectedPlaylistID] = useState<string | null>(null);
    const hasFetchedSongs = useRef(false);

    const generateSongs = useCallback(async () => {
        if (hasFetchedSongs.current) return;
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
                const songList: Song[] = Object.values(data.songs as { title: string; artist: string; album: string; image: string }[]).map((item) => ({
                    title: item.title,
                    artist: item.artist,
                    album: item.album,
                    image: item.image
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
        if (playlistSongs.length > 0) {
            generateSongs();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistSongs]);

    useEffect(() => {
        setIsLoading(false);
    }
    , []);  

    const handleSelectPlaylist = (playlistID: string) => {
        setSelectedPlaylistID(playlistID);
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
                            recommendedSongs.map((song, index) => (
                                <AddSong key={index} song={song} />
                            ))
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