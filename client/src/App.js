import React, { useState, useEffect } from "react";
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  const startTurn = () => {
    socket.emit("startTurn");
  };

  const playCard = (card) => {
    socket.emit("playCard", {
      cardToPlay: card,
    });
  };

  const judgePickedCard = (card) => {
    socket.emit("judgePickedCard", {
      judgePickedCard: card,
    });
  };

  const [userCards, setUserCards] = useState([]);
  const [fieldCards, setFieldCards] = useState([]);
  const [judge, setJudge] = useState("");
  const [canJudgePick, setCanJudgePick] = useState(false);
  const [judgeCard, setJudgeCard] = useState({ type: null, content: null });
  const [turn, setTurn] = useState(false);
  const [winner, setWinner] = useState({});

  const resetForTurn = () => {
    setUserCards([]);
    setFieldCards([]);
    setJudge("");
    setJudgeCard({ type: null, content: null });
    setTurn(false);
    setCanJudgePick(false);
  };

  useEffect(() => {
    socket.on("WINNER_FOUND", (data) => {
      console.log("data", data);
    });
  }, [socket, winner]);

  useEffect(() => {
    socket.on("judgeCanPick", (data) => {
      setCanJudgePick(data);
    });
  }, [socket, canJudgePick]);

  useEffect(() => {
    socket.on("startTurnResponse", (data) => {
      setTurn(true);
    });
  }, [socket, userCards]);

  useEffect(() => {
    socket.on("playerCards", (data) => {
      const { cards, socketId } = data;
      setUserCards(cards);
    });
  }, [socket, userCards]);

  useEffect(() => {
    socket.on("judgeCard", (data) => {
      const { judge, judgeCard } = data;
      setJudge(judge);
      setJudgeCard(judgeCard);
    });
  }, [socket, judge, judgeCard]);

  useEffect(() => {
    socket.on("judgePickedCardResponse", (data) => {
      console.log(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("fieldCardsUpdate", (data) => {
      setFieldCards(data);
    });
  }, [socket, fieldCards]);

  useEffect(() => {
    socket.on("playCardResponse", (data) => {
      if (!data.playedCard) {
        console.log("SOMETHING WENT WRONG: ", data.message);
      }
    });
  }, []);

  const isPlayerJudge = socket.id === judge;

  return (
    <div>
      <p>Hello {socket.id}!</p>

      <button onClick={startTurn}>START TURN</button>

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
            {fieldCards.length > 0 && (
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
            )}
          </div>
          <br />

          {userCards.length > 0 && (
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
          )}
        </>
      )}
    </div>
  );
}

export default App;
