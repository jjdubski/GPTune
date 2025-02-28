import { useState } from "react";
import "./SearchBar.css"; // Import the CSS file

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(query);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setQuery(value);
  //   onSearch?.(value);
  // };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="What music do you want to find?"
        value={query}
        className="search-input"
        onKeyDown = {handleKeyPress}
        onChange={handleChange}
      />
      <button onClick={() => onSearch?.(query)} className="search-button">
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
