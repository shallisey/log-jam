import React from "react";
import Deck from "../deck/Deck";
import MockDeck from "../MockDeck/MockDeck";
import "./GameBoard.css";

const GameBoard = () => {
  return (
    <div className="game-grid">
      <div className="mockdeck-top">
        <MockDeck className="mockdeck-top" text="top" />
      </div>
      <div className="mockdeck-right">
        <MockDeck className="mockdeck-right" text="right" />
      </div>
      <div className="playerdeck-bottom">
        <Deck className="playerdeck-bottom" />
      </div>
      <div className="mockdeck-left">
        <MockDeck className="mockdeck-left" text="left" />
      </div>
    </div>
  );
};

export default GameBoard;
