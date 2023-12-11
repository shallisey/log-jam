import socketIO from "socket.io-client";
import GameBoard from "./components/GameBoard/GameBoard";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  return (
    <div>
      <GameBoard />
    </div>
  );
}

export default App;
