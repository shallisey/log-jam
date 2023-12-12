import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  
  const startGame = () => {
    console.log("TEST");
    socket.emit("startGame")
  }

  return (
    <div>
      <p>Hello World!</p>
      <button onClick={() => startGame()} type="button">Click Me!</button>

    </div>
  );
}

export default App;
