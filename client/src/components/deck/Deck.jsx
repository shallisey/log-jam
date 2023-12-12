import React from "react";
import Card from "../Card/Card";

const Deck = ({ myCards, socket }) => {
  return (
    <div>
      {myCards?.map((card) => (
        <Card title={card.type} content={card.content} socket={socket} />
      ))}
    </div>
  );
};

export default Deck;
