import React, { useState, useEffect } from "react";
import socketIO from "socket.io-client";
import GameBoard from "./components/GameBoard/GameBoard";
import Login from "./components/Login/Login";

function App() {
  const [name, setName] = useState();
  const [socket, setSocket] = useState(null);
  const [cardHasBeenPicked, setCardHasBeenPicked] = useState(false);
  const [turn, setTurn] = useState(false);
  const [winner, setWinner] = useState({});

  useEffect(() => {
    if (socket === null) {
      setSocket(socketIO.connect("http://localhost:4000"));
    } else {
      socket?.on("WINNER_FOUND", (data) => {
        console.log("data", data);
      });
      
      socket?.on("judgePickedCardResponse", (data) => {
        setCardHasBeenPicked(true);
      });

      socket?.on("startTurnResponse", (data) => {
        setTurn(true);
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
  }

  const startTurn = () => {
    socket.emit("startTurn");
  };

  const startNextTurn = () => {
    socket.emit("startTurn");
  };
  

  return (
    <div>
      {/* {!name && <Login setName={setName} />} */}
      <GameBoard socket={socket} />
      <p>Hello {socket?.id}!</p>

      <button onClick={() => startGame()} type="button">
        Start!
      </button>
      <button onClick={() => endGame()} type="button">
        End!
      </button>

      {!turn && <button onClick={startTurn}>START TURN</button>}

      {cardHasBeenPicked && (
        <>
          <br />
          <button onClick={startNextTurn}>Start Next Turn</button>
        </>
      )}

      {turn && (
        <>
          <div>
            <h2>JUDGE:</h2>
          </div>


          <br />
          <div>
            {/* {fieldCards.length > 0 && (
              <div>
                <h1>FIELD CARDS</h1>
                <div>
                  {fieldCards.map((card, i) => (
                    <>
                      <div key={i}>
                        <h3>username: {card.username}</h3>
                        <h3>socketID of player: {card.playerSocketId}</h3>
                        <div>
                          <p>type: {card.type}</p>
                          <p>content: {card.content}</p>
                          {isPlayerJudge && canJudgePick && (
                            <button onClick={() => judgePickedCard(card)}>
                              Pick this card judge
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            )} */}
          </div>
          <br />

          {/* {userCards.length > 0 && (
            <>
              <h1>YOUR CARDS</h1>
              {userCards.map((card, i) => (
                <>
                  <br />
                  <div key={i}>
                    <h3>Type: {card.type}</h3>
                    <p> content: {card.content}</p>
                  </div>
                  {!isPlayerJudge && (
                    <button onClick={() => playCard(card)}>
                      play this card
                    </button>
                  )}
                  <br />
                </>
              ))}
            </>
          )} */}
        </>
      )}
    </div>
  );
}

export default App;
