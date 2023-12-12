import React, { useState, useEffect } from "react";
import socketIO from "socket.io-client";
import GameBoard from "./components/GameBoard/GameBoard";
import Login from "./components/Login/Login";

function App() {
  const [name, setName] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket === null) {
      setSocket(socketIO.connect("http://localhost:4000"));
    } else {
      socket?.on("WINNER_FOUND", (data) => {
        console.log("data", data);
      });

      socket?.on("judgeCanPick", (data) => {
        setCanJudgePick(data);
      });

      socket?.on("startTurnResponse", (data) => {
        setTurn(true);
      });

      socket?.on("judgeCard", (data) => {
        const { judge, judgeCard } = data;
        setJudge(judge);
        setJudgeCard(judgeCard);
      });

      socket?.on("judgePickedCardResponse", (data) => {
        setCardHasBeenPicked(true);
      });

      socket?.on("playCardResponse", (data) => {
        if (!data.playedCard) {
          console.log("SOMETHING WENT WRONG: ", data.message);
        }
      });
    }
  }, [socket]);

  const startGame = () => {
    console.log("TEST");
    socket.emit("startGame");
  };

  const startTurn = () => {
    socket.emit("startTurn");
  };

  const judgePickedCard = (card) => {
    socket.emit("judgePickedCard", {
      judgePickedCard: card,
    });
  };

  const startNextTurn = () => {
    socket.emit("startTurn");
  };

  const [judge, setJudge] = useState("");
  const [canJudgePick, setCanJudgePick] = useState(false);
  const [judgeCard, setJudgeCard] = useState({ type: null, content: null });
  const [cardHasBeenPicked, setCardHasBeenPicked] = useState(false);

  const [turn, setTurn] = useState(false);
  const [winner, setWinner] = useState({});

  const isPlayerJudge = socket?.id === judge;

  return (
    <div>
      {/* {!name && <Login setName={setName} />} */}
      <GameBoard socket={socket} />
      <p>Hello {socket?.id}!</p>

      <button onClick={() => startGame()} type="button">
        Click Me!
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
            <h2>JUDGE: {judge}</h2>
          </div>

          <div>
            JUDGE CARD
            {/* <h2>type: {judgeCard.type}</h2> */}
            <p>content: {judgeCard.content}</p>
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
