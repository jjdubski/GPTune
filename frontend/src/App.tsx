import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [currentTime, setCurrentTime] = useState(0)
  const [currentDate, setCurrentDate] = useState(0)
  useEffect(() => {
    fetch('http://localhost:8000').then(res => res.json()).then(data => {
      setCurrentTime(data.current_time)
      setCurrentDate(data.current_date)
    })
  }, [])

  return (
    <>
    <div className='App'>
      <header className='App-header'>
        <img src={viteLogo} className='logo' alt='Vite logo' />
        <img src={reactLogo} className='logo react' alt='React logo' />
        <h1>Vite + React</h1>
        <p>The date is {currentDate} and the time is {currentTime}.</p><br />
      </header>
    </div>
    </>
  )
}

export default App
