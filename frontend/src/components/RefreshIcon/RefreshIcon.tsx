//import { useState } from "react";

interface RefreshButtonProps {
    onRefresh: () => void; // Function to trigger refresh
  }
  
  const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
    return (
      <button className="refresh-button" onClick={onRefresh}>
        🔄 Refresh Songs
      </button>
    );
  };
  
  export default RefreshButton;