import React, { useEffect, useState } from "react";
import Deck from "../deck/Deck";
import MockDeck from "../MockDeck/MockDeck";
import Card from "../Card/Card";
import "./GameBoard.scss";

const GameBoard = ({ socket }) => {
  const [judgeCard, setJudgeCard] = useState({
    title: "Judge Card",
    content: "content Judge",
  });
  const [userCards, setUserCards] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);
  const [judge, setJudge] = useState("");
  const [canJudgePick, setCanJudgePick] = useState(false);

  const isPlayerJudge = socket?.id === judge;

  useEffect(() => {
    if (socket !== null) {
      socket?.on("playerCards", (data) => {
        const { cards, socketId } = data;
        setUserCards(cards);
        console.log(cards);
      });

      socket?.on("fieldCardsUpdate", (data) => {
        setPlayedCards(data);
        console.log(data);
      });

      socket?.on("judgeCard", (data) => {
        const { judge, judgeCard } = data;
        setJudge(judge);
        setJudgeCard(judgeCard);
      });

      socket?.on("judgeCanPick", (data) => {
        setCanJudgePick(data);
      });
    }
  }, [socket]);

  return (
    <div className="game-grid">
      <div className="mockdeck-top">
        <MockDeck />
      </div>
      <div className="mockdeck-right">
        <MockDeck />
      </div>
      <div className="judge-card">
        <Card card={judgeCard} isJudge={true} />
      </div>
      <div className="played-cards">
        <Deck
          myCards={playedCards}
          socket={socket}
          playedCardArea={true}
          isPlayerJudge={isPlayerJudge}
          canJudgePick={canJudgePick}
        />
      </div>
      <div className="playerdeck-bottom">
        <Deck
          myCards={userCards}
          socket={socket}
          isPlayerJudge={isPlayerJudge}
        />
      </div>
      <div className="mockdeck-left">
        <MockDeck />
      </div>
      {/* <GameInfo /> */}
    </div>
  );
};

export default GameBoard;
