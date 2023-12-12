import React, { useState } from "react";
import Deck from "../deck/Deck";
import MockDeck from "../MockDeck/MockDeck";
import GameInfo from "../GameInfo/GameInfo";
import Card from "../Card/Card";
import "./GameBoard.scss";

const myCards = [
  { title: "title 1", content: "content 1" },
  { title: "title 2", content: "content 2" },
  { title: "title 3", content: "content 3" },
  { title: "title 4", content: "content 4" },
  { title: "title 5", content: "content 5" },
];

const GameBoard = () => {
  const [judgeCard, setJudgeCard] = useState({
    title: "Judge Card",
    content: "content Judge",
  });

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
        <Deck myCards={myCards.slice(0, 4)} />
      </div>
      <div className="playerdeck-bottom">
        <Deck myCards={myCards} />
      </div>
      <div className="mockdeck-left">
        <MockDeck />
      </div>
      <GameInfo />
    </div>
  );
};

export default GameBoard;
