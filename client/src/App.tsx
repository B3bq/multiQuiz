import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Menu from './screens/Menu';
import Game from './screens/Game';
import Lobby from './screens/Lobby';
import Dictionary from "./screens/Dictionary";
import Chooser from "./screens/Chooser";
import Create from "./screens/Create";
import GameHost from "./screens/GameHost";

function App() {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("https://multiquiz.onrender.com");
        if (response.ok) {
          setBackendReady(true);
          return true;
        }
      } catch (error) {
        return false;
      }
  };

  const interval = setInterval(async () => {
    const isReady = await checkBackend();
    if (isReady) clearInterval(interval);
  }, 3000);

  checkBackend();

  return () => clearInterval(interval);
  }, []);

  if (!backendReady) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="spinner"></div>
        <p>Server is initializing... (it could take a few seconds)</p>
      </div>
    );
  }


  return(
  <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/dictionary" element={<Dictionary />} />
      <Route path="/choose" element={<Chooser />} />
      <Route path="/create" element={<Create />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/game" element={<Game />} />
      <Route path="/gamehost" element={<GameHost />} />
  </Routes>
  )
}

export default App;