import React from 'react'
import { useState, useEffect } from 'react'

// interface HomeProps {
//   currentDate: number
//   currentTime: number
// }

// const Home: React.FC<HomeProps> = ({ currentDate, currentTime }) => {
const Home: React.FC = () => {
    const [currentTime, setCurrentTime] = useState('')
    const [currentDate, setCurrentDate] = useState('')

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
            fetch('http://localhost:8000').then(res => res.json()).then(data => {
                setCurrentTime(data.current_time)
                setCurrentDate(data.current_date)
            })
        }

        fetchData()
        const interval = setInterval(fetchData, 1000)

        return () => clearInterval(interval)
    }
    ,[])
    return (
        <div>
            <h2>Home Page</h2>
            <p>The date is {currentDate} and the time is {currentTime}.</p>
        </div>
    )
}

export default Home;