import React from 'react';
import { Link } from 'react-router-dom';
import reactLogo from '../../assets/react.svg'
import viteLogo from '/vite.svg'
import './Navbar.css'; // Assuming you have some CSS for styling


const Navbar: React.FC = () => {

    return (
        <header className='App-header'>
        <img src={viteLogo} className='logo' alt='Vite logo' />
        <img src={reactLogo} className='logo react' alt='React logo' />
        <h1>Vite + React</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/songs">Songs</Link> | <Link to="/playlist">Playlist</Link> | <Link to ="http://127.0.0.1:8000/login/">Login</Link>
        </nav>
        </header>
    );
};

export default Navbar;