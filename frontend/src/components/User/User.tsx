import React from "react";
import "./User.css";
import { Link } from "react-router-dom";
import logoutIcon from "/logout-icon.png";
import { useState } from "react";

interface UserProps {
    username: string;
    image: string;
  }
  
  const User: React.FC<UserProps> = ({ username, image }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const buttonStyle = {
      backgroundColor: isHovered ? 'var(--secondary)' : 'var(--primary)',
    };

    return (
      <button 
        className="user-button" 
        style={buttonStyle}
      >
        <img src={image} alt="pfp" className="icon" />
        <p className="username">{username}</p>
        <span className="divider"></span>
        <Link 
          className="logout-icon" 
          to="http://localhost:8000/logout"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
            <img className="logout-icon" src={logoutIcon} alt="Logout Icon"></img>
        </Link>
      </button>
    );
  };
  
  export default User;
