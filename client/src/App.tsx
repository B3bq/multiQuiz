import { useEffect, useState } from "react";
import { socket } from "./socket";
import { Routes, Route } from "react-router-dom";
import Menu from './screens/Menu';
import Game from './screens/Game';
import Lobby from './screens/Lobby';
import Dictionary from "./screens/Dictionary";

function App() {
  return(
  <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/dictionary" element={<Dictionary />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/game" element={<Game />} />
  </Routes>
  )
  //useEffect(() => {
  //  socket.on("connect", () => {
  //    console.log("Połączono z serwerem:", socket.id);
  //  });
//
  //  socket.on("joined_successfully", () => {
  //    console.log("Dołączono do lobby!");
  //  });
//
  //  return () => {
  //    socket.off("connect");
  //    socket.off("joined_successfully");
  //  };
  //}, []);
//
  //const joinLobby = () => {
  //  socket.emit("join_lobby", "Mirek");
  //};
//
  //return (
  //  <div>
  //    <button onClick={joinLobby}>
  //      Dołącz do lobby
  //    </button>
  //  </div>
  //);
}

export default App;