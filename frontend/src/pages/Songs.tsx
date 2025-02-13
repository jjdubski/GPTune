import React from 'react'
import { Link } from 'react-router-dom'

const Songs: React.FC = () => {
    return (
        <div>
            <h2>Songs Page</h2>
            <p>This is the songs page.</p>
            <Link to="http://localhost:8000/songAPI/">See API</Link>
        </div>
    )
}

export default Songs