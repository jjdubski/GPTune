import React, { useState } from "react";
import "./RefreshButton.css";

interface RefreshButtonProps {
  onRefresh: () => void; // Function to call when the button is clicked
  styles?: React.CSSProperties; // Optional styles for the button
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ styles, onRefresh }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    console.log("Refresh button clicked!"); // Debugging log
    setIsClicked(true);
    onRefresh(); // Call the passed function when the button is clicked
    setTimeout(() => {
      setIsClicked(false);
    }, 5000); // Spin for 5 seconds
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
