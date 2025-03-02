import React, { useState } from "react";
import "./RefreshIcon.css";

interface RefreshButtonProps {
    styles?: React.CSSProperties; // Optional styles for the button
  }
  
  const RefreshButton: React.FC<RefreshButtonProps> = ({ styles }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => {
          setIsClicked(false);
      }, 3000); // Spin for 3 seconds
  };

    if (!styles) {
      styles = {
        animation: isClicked ? 'spin 2s linear infinite' : 'none'
      };
    }

    // const handleClick = () => {
    //   const icon = document.querySelector(".refresh-icon") as HTMLElement;
    //   if (icon) {
    //     icon.style.animation = "spin 2s linear infinite";
    //     setTimeout(() => {
    //       icon.style.animation = "none";
    //     }, 2000); // Adjust the duration to match the CSS animation duration
    //   }
    // };
    return (
      <button style={styles} className="refresh-button">
        <img src="/refresh.png" alt="Refresh" className="refresh-icon" onClick={handleClick}/>
      </button>
    );
  };
  
  export default RefreshButton;