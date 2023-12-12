import React from "react";
import Deck from "../deck/Deck";
import MockDeck from "../MockDeck/MockDeck";
import "./GameBoard.css";

const myCards = [
  { title: "title 1", content: "content 1" },
  { title: "title 2", content: "content 2" },
  { title: "title 3", content: "content 3" },
  { title: "title 4", content: "content 4" },
  { title: "title 5", content: "content 5" },
];

const GameBoard = () => {
  return (
    <div className="game-grid">
      <div className="mockdeck-top">
        <MockDeck text="top" />
      </div>
      <div className="mockdeck-right">
        <MockDeck text="right" />
      </div>
      <div className="played-cards">
        <Deck myCards={myCards.slice(0, 4)} />
      </div>
      <div className="playerdeck-bottom">
        <Deck myCards={myCards} />
      </div>
      <div className="mockdeck-left">
        <MockDeck text="left" />
      </div>
      <div className="game-info">
        <h1>Hello World I'm LogJam!</h1>
        Game Info
      </div>
    </div>
  );
};

export default GameBoard;
