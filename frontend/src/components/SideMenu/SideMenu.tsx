import React, { useState } from "react";
import "./SideMenu.css";
import { Link } from "react-router-dom";
import logoutIcon from "/logout-icon.png";

const SideMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <> 
        <div>
            {/* Hamburger Menu Button */}
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span className="burger"></span>
                <span className="burger"></span>
                <span className="burger"></span>
            </div>

            {/* Sidebar Menu */}
            <div className={`side-menu`}>
                <p className="close-btn" onClick={() => setIsOpen(!isOpen)}>X</p>
                <Link className="menu-item" to="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link className="menu-item" to="/add-to-playlist" onClick={() => setIsOpen(false)}>Add to Playlist</Link>
                <Link className="menu-item" to="/this-or-that" onClick={() => setIsOpen(false)}>This Or That</Link>
                <Link className="menu-item" to="/discover" onClick={() => setIsOpen(false)}>Discover</Link>
                <Link className="menu-item" to="http://localhost:8000/logout" onClick={() => setIsOpen(false)}>Logout 
                    <img className="logoutIcon" src={logoutIcon} alt="Logout Icon"></img>
                </Link>
            </div>
        </div>
        <style >
            {`
                .side-menu {
                    transform: ${isOpen ? "translateX(0)" : "translateX(-300px)"};
                    opacity: ${isOpen ? "1" : "0"};
                }
                .hamburger {
                    transform: ${isOpen ? "translateX(-100px)" : "translateX(0)"};
                    opacity: ${isOpen ? "0" : "1"};
                }
            `}
        </style>
        </>
    );
};


export default SideMenu;
