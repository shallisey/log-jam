import React, { useState } from "react";
import socketIO from "socket.io-client";
import GameBoard from "./components/GameBoard/GameBoard";
import Login from "./components/Login/Login";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  const [name, setName] = useState();

  return (
    <div>
      {!name && <Login setName={setName} />}
      <GameBoard />
    </div>
  );
}

export default App;
