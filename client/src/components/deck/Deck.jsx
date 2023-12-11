import React from "react";
import Card from "../Card/Card";

const myCards = [
  { title: "title 1", content: "content 1" },
  { title: "title 2", content: "content 2" },
  { title: "title 3", content: "content 3" },
  { title: "title 4", content: "content 4" },
  { title: "title 5", content: "content 5" },
];

const Deck = () => {
  return (
    <div>
      {myCards.map((card) => (
        <Card title={card.title} content={card.content} />
      ))}
    </div>
  );
};

export default Deck;
