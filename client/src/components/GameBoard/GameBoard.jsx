import React, { useEffect, useState } from "react";
import Deck from "../deck/Deck";
import MockDeck from "../MockDeck/MockDeck";
import GameInfo from "../GameInfo/GameInfo";
import Card from "../Card/Card";
import "./GameBoard.scss";

const GameBoard = ({ socket }) => {
  const [judgeCard, setJudgeCard] = useState({
    title: "Judge Card",
    content: "content Judge",
  });

  const [userCards, setUserCards] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);

  useEffect(() => {
    if (socket !== null) {
      socket?.on("playerCards", (data) => {
        const { cards, socketId } = data;
        setUserCards(cards);
      });

      socket?.on("fieldCardsUpdate", (data) => {
        setPlayedCards(data);
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
        <Card
          title={judgeCard.title}
          content={judgeCard.content}
          isJudge={true}
        />
      </div>
      <div className="played-cards">
        <Deck myCards={playedCards} socket={socket} />
      </div>
      <div className="playerdeck-bottom">
        <Deck myCards={userCards} socket={socket} />
      </div>
      <div className="mockdeck-left">
        <MockDeck />
      </div>
      <GameInfo />
    </div>
  );
};

export default GameBoard;
