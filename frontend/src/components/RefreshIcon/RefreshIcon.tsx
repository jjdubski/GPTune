import React, { useState } from "react";
import "./RefreshIcon.css";

interface RefreshButtonProps {
  onRefresh: () => void; // Function to call when the button is clicked
  styles?: React.CSSProperties; // Optional styles for the button
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ styles }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 1500); // Spin for 2 seconds
  };

  return (
    <button className="refresh-button" onClick={handleClick}>
      <img
        src="/refresh.png"
        alt="Refresh"
        className={`refresh-icon ${isClicked ? "spinning" : ""}`}
        style={styles}
      />
    </button>
  );
};

export default RefreshButton;