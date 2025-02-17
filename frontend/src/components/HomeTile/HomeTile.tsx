import React, { useEffect, useState } from 'react';
import './HomeTile.css';

interface  HomeTileProps  {
    title: string;
    img : string;
}
const HomeTile: React.FC< HomeTileProps> = ({ title, img }) => {
    return (
        <div className="tile">
            <div className="tile-content">
                <img src={img} alt={`${title} Icon`} className="tile-icon" />
                <p className = "tile-title">{title}</p> 
            </div>
        </div>
    );
};
// const HomeTile = () => {
//     return (
//         <div className="music-home-container">
//             <HomeTile title="Discover" img="linktodiscoverimg.com" />
//             <HomeTile title="Add to Playlist" img="linktoaddtoplaylistimg.com" />
//             <HomeTile title="This or That?" img="linktothisorthatimg.com" />
//         </div>
//     );

export default HomeTile;
