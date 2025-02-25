import React from 'react'
import { useState, useEffect } from 'react'
import './Home.css'
import HomeTile from '../components/HomeTile/HomeTile'
import SideMenu from '../components/SideMenu/SideMenu'
import SpotifyButton from '../components/SpotifyButton/SpotifyButton'
import './Home.css'


// interface HomeProps {
//   currentDate: number
//   currentTime: number
// }

// const Home: React.FC<HomeProps> = ({ currentDate, currentTime }) => {
const Home: React.FC = () => {
    const [currentTime, setCurrentTime] = useState('')
    const [currentDate, setCurrentDate] = useState('')
    const [currentUser, setCurrentUser] = useState<{ email: string }>({ email: '' })

    // Fetches date and time from backend on load/reload
    // useEffect(() => {
    //   fetch('http://localhost:8000').then(res => res.json()).then(data => {
    //     setCurrentTime(data.current_time)
    //     setCurrentDate(data.current_date)
    //   })
    // }

    // Updates date and time every second
    useEffect(() => {
        const fetchData = () => {
            fetch('http://127.0.0.1:8000').then(res => res.json()).then(data => {
                setCurrentTime(data.current_time)
                setCurrentDate(data.current_date)
                setCurrentUser({ email: data.user.email })
            })
        }

        fetchData()
        const interval = setInterval(fetchData, 1000)

        return () => clearInterval(interval)
    }
    ,[])
    return (
        <div className="home-container">
            {/* Side Menu */}
            <SideMenu />
            <div>
                <div className="spotify-button-container">
                    <SpotifyButton 
                        title="Link Spotify"
                        img="./SpotifyButton.png"
                    />
                </div>


                
                <div className="music-home-container">
                    <HomeTile title="Discover" img = "/Discover.png" />  
                    <HomeTile title="Add to Playlist" img="./AddtoPlaylist.png" />
                    <HomeTile title="This or That?" img="./ThisorThat.png" />
                </div>

                <p>The date is  {currentDate} and the time is {currentTime}.</p>
                <p>Logged in as: {currentUser.email}</p>

            </div>
        </div>
    )
}

export default Home;