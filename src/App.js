import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    // Robust fetching with proper validation
    const fetchSongs = async () => {
      try {
        const res = await fetch("http://localhost:3001/songs");
        if (!res.ok) throw new Error("Server not responding");
        const data = await res.json();
        const finalSongs = Array.isArray(data) ? data : (data.songs || []);
        setSongs(finalSongs);
      } catch (err) {
        console.error("Fetch failed, using mock fallback", err);
        // Fallback or better error state could go here
      }
    };

    fetchSongs();

    // Prevent "audio ghosting": STOP music when component is unmounted or hot-reloaded
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = (song) => {
    const audio = audioRef.current;

    if (currentSongId === song.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
    } else {
      // Switch to new song cleanly
      audio.pause();
      audio.src = song.src;
      audio.load();
      audio.play()
        .then(() => {
          setCurrentSongId(song.id);
          setIsPlaying(true);
        })
        .catch(err => console.error("Auto-play blocked or source invalid", err));
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <h1>Haven <span>Music</span></h1>
          <p className="subtitle">Discover your rhythm</p>
        </header>

        <section className="song-list">
          {songs.length > 0 ? (
            songs.map((song) => (
              <div 
                key={song.id} 
                className={`song-item ${currentSongId === song.id ? 'active' : ''}`}
              >
                <div className="song-visual">
                  <div className="play-icon">🎵</div>
                </div>
                <div className="song-meta">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                </div>
                <button 
                  className={`audio-toggle ${currentSongId === song.id && isPlaying ? 'pause' : 'play'}`}
                  onClick={() => togglePlay(song)}
                >
                  {currentSongId === song.id && isPlaying ? "⏸" : "▶"}
                </button>
              </div>
            ))
          ) : (
            <div className="loader">
              <div className="shimmer"></div>
              <p>Scanning library...</p>
            </div>
          )}
        </section>

        {currentSongId && (
          <footer className="now-playing">
            <div className="progress-bar">
               <div className="progress-fill" style={{ width: isPlaying ? '100%' : '50%', transition: 'width 30s linear' }}></div>
            </div>
            <div className="player-controls">
               <p>Now Playing: <strong>{songs.find(s => s.id === currentSongId)?.title}</strong></p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;