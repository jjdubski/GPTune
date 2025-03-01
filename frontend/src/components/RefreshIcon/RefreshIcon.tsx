import React from "react";
import "./Refreshicon.css";

interface RefreshButtonProps {
    onRefresh: () => void; // Function to trigger refresh
  }
  
  const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
    return (
      <button className="refresh-button" onClick={onRefresh}>
        <img src="/refresh.png" alt="Refresh" className="refresh-icon" />
      </button>
    );
  };
  
  export default RefreshButton;