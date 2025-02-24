import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.tsx'
import Songs from './pages/Songs'
import Navbar from './components/Navbar/Navbar'
import Playlists from './pages/Playlists'
import WebPlayback from './components/WebPlayback/WebPlayback'
import { useEffect, useState } from 'react'


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
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/playlist" element={<Playlists />} />
        </Routes>
        <WebPlayback token={token} />
      </div>
    </Router>
  )
}

export default App
