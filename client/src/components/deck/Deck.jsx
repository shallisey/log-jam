import React from "react";
import Card from "../Card/Card";

const Deck = ({ myCards }) => {
  return (
    <div>
      {myCards?.map((card) => (
        <Card title={card.title} content={card.content} />
      ))}
    </div>
  );
};

export default Deck;
