import { Routes, Route } from "react-router-dom";
import Menu from './screens/Menu';
import Game from './screens/Game';
import Lobby from './screens/Lobby';
import Dictionary from "./screens/Dictionary";
import Chooser from "./screens/Chooser";
import Create from "./screens/Create";
import GameHost from "./screens/GameHost";

function App() {
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