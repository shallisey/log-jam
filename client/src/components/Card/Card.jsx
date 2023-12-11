import React, { useState } from "react";
import "./Card.css";

const Card = ({ title, content, deckType }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div class="scene scene--card">
      <div
        class={!isFlipped ? "card" : "card is-flipped"}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div class="card__face card__face--front">front</div>
        <div class="card__face card__face--back">
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
