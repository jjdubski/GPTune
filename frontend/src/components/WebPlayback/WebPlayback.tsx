import React, { useState, useEffect } from 'react';

interface WebPlaybackProps {
    token: string;
}

const WebPlayback: React.FC<WebPlaybackProps> = ({ token }) => {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [trackInfo, setTrackInfo] = useState<{ title: string; artist: string; position: number } | null>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            
            player.addListener('player_state_changed', (state) => {
                if(!state) {
                    console.error('No state received');
                    return;
                }

                const currentTrack = state.track_window.current_track;
                const position = state.position;
                const artist = currentTrack.artists.map((artist) => artist.name).join(', ');
                const title = currentTrack.name;

                setTrackInfo({title, artist, position});
            });
            player.connect();
        };

        return () => {
            if (player) {
                player.disconnect();
            }
        };
    }, [token]);

    return (
        <div className="container">
            <div className="main-wrapper">
                <h1>Spotify Web Playback SDK</h1>
                <p>Player status: {player ? 'Connected' : 'Not connected'}</p>
                {trackInfo && (
                    <div>
                        <p>Now Playing: {trackInfo.title} by {trackInfo.artist}</p>
                        <p>Current Position: {trackInfo.position} ms</p>
                    </div>
                )}
                <div id="spotify-player"></div>
                <button onClick={() => player?.previousTrack()}>Previous</button>
                <button onClick={() => player?.togglePlay()}>Play/Pause</button>
                <button onClick={() => player?.nextTrack()}>Next</button>
            </div>
        </div>
    );
}

export default WebPlayback;