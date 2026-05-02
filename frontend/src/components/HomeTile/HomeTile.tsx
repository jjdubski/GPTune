import React from 'react';
import './HomeTile.css';

interface HomeTileProps {
    title: string;
    img: string;
}

const HomeTile: React.FC<HomeTileProps> = ({ title, img }) => {
    return (
        <button type="button" className="tile">
            <div className="tile-content">
                <img src={img} alt={`${title} Icon`} className="tile-icon" />
                <p className="tile-title">{title}</p>
            </div>
        </button>
    );
};

export default HomeTile;
