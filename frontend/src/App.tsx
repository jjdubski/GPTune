import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.tsx'
import Songs from './pages/Songs'
import Navbar from './components/Navbar.tsx'

function App() { 
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<Songs />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
