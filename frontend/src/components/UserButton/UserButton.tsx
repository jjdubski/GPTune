interface UserButtonProps {
    username: string;
    onLogout: () => void;
  }
  
  const UserButton: React.FC<UserButtonProps> = ({ username, onLogout }) => {
    return (
      <button onClick={onLogout} className="user-button">
        <img src="/spotify-logo.png" alt="Spotify" className="icon" />
        <span className="username">{username}</span>
        <img src="/logout-icon.png" alt="Logout" className="logout-icon" />
      </button>
    );
  };
  
  export default UserButton;
  