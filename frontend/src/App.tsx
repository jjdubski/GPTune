import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.tsx'
import Songs from './pages/Songs.tsx'
import Playlists from './pages/Playlists.tsx'
import AddtoPlaylist from './pages/AddToPlaylist.tsx'
// import WebPlayback from './components/WebPlayback/WebPlayback'
import { useEffect, useState } from 'react'
import SideMenu from './components/SideMenu/SideMenu.tsx'
import Search from './pages/Search.tsx'
import SpotifyPlayer from 'react-spotify-web-playback';


function App() { 
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/getToken')
      .then(res => res.json())
      .then(data =>{
        if (data) {
          console.log('Token: ', data.access_token)
          setToken(data.access_token)
        }
        else {
          console.error('Failed to get token')
        }
      }
    )
    .catch(error => console.error('Error Fetching Token: ', error))

  }
  ,[])
  return (
    <Router>
      <div className='App'>
        <SideMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/add-to-playlist" element={<AddtoPlaylist />} />
          <Route path ="/search" element={<Search />} />
          {/* <Route path="logout" element={<Logout />} /> */}
          {/* <Route path='/discover' element={<Discover />} /> */}
          {/* <Route path='/this-or-that' element={<ThisOrThat />} /> */}
        </Routes>
        {/* {token && <WebPlayback token={token} />} */}
        <div className="player">
          {token && <SpotifyPlayer token={token} uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
          styles={{
            bgColor: '#333333',
            color: 'white',
            loaderColor: '#fff',
            sliderColor: '#1cb954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}/>}
        </div>
      </div>
    </Router>
  )
}

export default App
