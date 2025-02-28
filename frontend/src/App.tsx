import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Songs from './pages/Songs'
import Playlists from './pages/Playlists'
import AddtoPlaylist from './pages/AddToPlaylist'
// import WebPlayback from './components/WebPlayback/WebPlayback'
import { use, useEffect, useState } from 'react'
import SideMenu from './components/SideMenu/SideMenu.tsx'
import Search from './pages/Search.tsx'
import SpotifyPlayer from 'react-spotify-web-playback';


function App() { 
  const [token, setToken] = useState<string | null>(null)
  const [user, setSubscription] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

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
    setIsLoading(false)
  }
  ,[])

  useEffect(() => {
    if (token !== null) {
      fetch('http://localhost:8000/getUser')
        .then(res => res.json())
        .then(data => {
          if (data) {
            console.log('User: ', data)
            setSubscription(data.product)
          }
          else {
            console.error('Failed to set user')
          }
        }
      )
      .catch(error => console.error('Error Fetching User: ', error))
    }
  }, [token])

  return (
    <Router>
      <div className='App'>
      <SideMenu />
      {isLoading ? (
        <></>
      ) : (
        <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/add-to-playlist" element={<AddtoPlaylist />} />
          <Route path="/search" element={<Search />} />
          {/* <Route path="logout" element={<Logout />} /> */}
          {/* <Route path='/discover' element={<Discover />} /> */}
          {/* <Route path='/this-or-that' element={<ThisOrThat />} /> */}
        </Routes>
        {/* {token && <WebPlayback token={token} />} */}
        <div className="player">
          {token && (user && user == 'premium') && <SpotifyPlayer 
          token={token} 
          uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
          showSaveIcon={true}
          styles={{
            bgColor: 'black',
            color: 'white',
            loaderColor: '#fff',
            sliderColor: '#1cb954',
            sliderHandleColor: '#fff',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}/>}
        </div>
        </>
      )}  
      </div>
    </Router>
  )
}

export default App
