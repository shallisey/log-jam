import React, { useState, useEffect } from "react";
import socketIO from "socket.io-client";
import GameBoard from "./components/GameBoard/GameBoard";
import "./App.scss";

function App() {
  const [socket, setSocket] = useState(null);
  const [cardHasBeenPicked, setCardHasBeenPicked] = useState(false);
  const [turn, setTurn] = useState(false);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [winner, setWinner] = useState({});
  const [winningCard, setWinningCard] = useState({});
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [sentName, setSetName] = useState(false);

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
        setWinningCard(data?.card);
        setPlayers(data.players);
      });

      socket?.on("startTurnResponse", (data) => {
        setTurn(true);
      });

      socket?.on("gameStarted", (data) => {
        setGameHasStarted(true);
        console.log("players", data);
        setPlayers(data);
      });

      socket?.on("playCardResponse", (data) => {
        if (!data.playedCard) {
          console.log("SOMETHING WENT WRONG: ", data.message);
        }
      });
    }
  }, [socket]);

  const joinGame = () => {
    socket?.emit("newPlayer", name);
    setSetName(true);
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
        {!gameHasStarted && !sentName && (
          <div className="modal-container">
            <div className="modal">
              <>
                <p>Enter your name below to join a LogJam game</p>
                <input onChange={(e) => setName(e.target.value)} type="text" />
              </>
              <button onClick={() => joinGame()}>Join Game!</button>
            </div>
          </div>
        )}
        {!gameHasStarted && sentName && (
          <div className="modal-container">
            <div className="modal">
              <>
                <p>Waiting...</p>
              </>
            </div>
          </div>
        )}
        {winner?.winnningPlayer && (
          <div className="modal-container">
            <div className="modal">
              {socket.id === winner?.winnningPlayer?.socketId ? (
                <h3>You Won!</h3>
              ) : (
                <h3>Player {winner?.winnningPlayer?.username} Won!</h3>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        <GameBoard
          socket={socket}
          players={players}
          winningCard={winningCard}
          setWinningCard={setWinningCard}
        />
      </div>
    </div>
  );
}

export default App;
