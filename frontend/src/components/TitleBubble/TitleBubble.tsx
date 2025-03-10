import React from "react";
import "./TitleBubble.css"; // Import the CSS file

interface TitleBubbleProps {
  text: string;
}

const TitleBubble: React.FC<TitleBubbleProps> = ({ text }) => {
  return (
    <div className="title-bubble">
      <span className="title-text">{text}</span>
      <div className="title-border"></div>
    </div>
  );
};

export default TitleBubble;