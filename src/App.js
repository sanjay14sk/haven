import { useEffect, useState } from "react";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data));
  }, []);

  const playSong = (song) => {
   const audio = new Audio(song.src);
    audio.play();
    setCurrentSong(audio);
  };

  const pauseSong = () => {
    if (currentSong) {
      currentSong.pause();
    }
  };

  return (
    <div>
      <h1>My Music App 🎵</h1>

      {songs.map((song) => (
        <div key={song.id}>
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
          <button onClick={() => playSong(song)}>Play</button>
        </div>
      ))}
      <button onClick={pauseSong}>Pause</button>
    </div>
  );
}

export default App;