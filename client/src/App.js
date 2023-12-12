import React, { useState, useEffect } from "react";
import socketIO from "socket.io-client";
import GameBoard from "./components/GameBoard/GameBoard";
import Login from "./components/Login/Login";

function App() {
  const [name, setName] = useState();
  const [socket, setSocket] = useState(null);
  const [cardHasBeenPicked, setCardHasBeenPicked] = useState(false);
  const [turn, setTurn] = useState(false);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [winner, setWinner] = useState({});

  useEffect(() => {
    if (socket === null) {
      setSocket(socketIO.connect("http://localhost:4000"));
    } else {
      socket?.on("WINNER_FOUND", (data) => {
        console.log("winner found", data);
        setWinner(data);
      });

      socket?.on("judgePickedCardResponse", (data) => {
        setCardHasBeenPicked(true);
      });

      socket?.on("startTurnResponse", (data) => {
        setTurn(true);
      });

      socket?.on("gameStarted", () => {
        setGameHasStarted(true);
      });

      socket?.on("playCardResponse", (data) => {
        if (!data.playedCard) {
          console.log("SOMETHING WENT WRONG: ", data.message);
        }
      });
    }
  }, [socket]);

  const startGame = () => {
    console.log("start");
    socket.emit("startGame");
  };
  const endGame = () => {
    console.log("end");
    socket.emit("endGame");
  };

  const startTurn = () => {
    socket.emit("startTurn");
  };

  const startNextTurn = () => {
    socket.emit("startTurn");
  };

  return (
    <div>
      <div>
        {winner && (
          <>
            <h1>{winner.username}</h1>
            <h1>{winner.socketId}</h1>
          </>
        )}
      </div>
      <div>
        {!gameHasStarted && (
          <button onClick={() => startGame()}>Start game</button>
        )}
      </div>
      <div>
        {/* {!name && <Login setName={setName} />} */}
        <GameBoard socket={socket} />
        <p>Hello {socket?.id}!</p>
      </div>

      <button onClick={() => endGame()} type="button">
        End!
      </button>

      {cardHasBeenPicked && (
        <>
          <br />
          <button onClick={startNextTurn}>Start Next Turn</button>
        </>
      )}
    </div>
  );
}

export default App;
