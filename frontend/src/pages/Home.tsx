import React from 'react'
import { useState, useEffect } from 'react'
import HomeTile from '../components/HomeTile/HomeTile'
import SideMenu from '../components/SideMenu/SideMenu'


// interface HomeProps {
//   currentDate: number
//   currentTime: number
// }

// const Home: React.FC<HomeProps> = ({ currentDate, currentTime }) => {
const Home: React.FC = () => {
    const [currentTime, setCurrentTime] = useState('')
    const [currentDate, setCurrentDate] = useState('')
    const [currentUser, setCurrentUser] = useState('')

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
                setCurrentUser(data.user)
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
                <h2>Home Page</h2>
                <p>The date is  {currentDate} and the time is {currentTime}.</p>
                <p>Logged in as: {currentUser.email}</p>
                <div className="music-home-container">
                    <HomeTile title="Discover" img = "/Discover.png" />  
                    <HomeTile title="Add to Playlist" img="./AddtoPlaylist.png" />
                    <HomeTile title="This or That?" img="./ThisorThat.png" />
                </div>
            </div>
        </div>
    )
}

export default Home;