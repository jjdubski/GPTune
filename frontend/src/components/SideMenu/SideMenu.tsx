import React, { useState } from "react";
import "./SideMenu.css";

const SideMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    

    const menuItems = [
        { title: "Discover" },
        { title: "Playlist" },
        { title: "This or That" },
    ];

    return (
        <> 
        <div>
            {/* Hamburger Menu Button */}
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span className={`burger burger1 `}></span>
                <span className={`burger burger2`}></span>
                <span className={`burger burger3`}></span>
            </div>

            {/* Sidebar Menu */}
            <div className={`side-menu`}>
                <p className="close-btn" onClick={() => setIsOpen(!isOpen)}>X</p>
                {menuItems.map((item, index) => (
                    <div key={index} className="menu-item">
                        {item.title}
                    </div>
                ))}
            </div>
        </div>
        <style>
            {`
                .side-menu {
                    overflow: hidden;
                    display: ${isOpen ? "block" : "none"};
                }
            
            `}
        </style>
        </>
    );
};


export default SideMenu;
