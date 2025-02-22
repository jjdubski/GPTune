//import { useState } from "react";

interface RefreshButtonProps {
    onRefresh: () => void; // Function to trigger refresh
  }
  
  const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
    return (
      <button className="refresh-button" onClick={onRefresh}>
        <img src="/refreshicon.png" alt="Refresh" className="refresh-icon" />
      </button>
    );
  };
  
  export default RefreshButton;