import React from "react";
import Deck from "../deck/Deck";
import MockDeck from "../MockDeck/MockDeck";
import "./GameBoard.css";

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
        <Deck />
      </div>
      <div className="playerdeck-bottom">
        <Deck className="playerdeck-bottom" />
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
