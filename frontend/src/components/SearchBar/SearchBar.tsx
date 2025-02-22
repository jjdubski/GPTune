import { useState } from "react";
import "./SearchBar.css"; // Import the CSS file

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="What music do you want to find?"
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      <button onClick={() => onSearch?.(query)} className="search-button">
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
