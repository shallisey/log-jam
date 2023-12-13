import React, { useEffect, useState } from "react";
import "./Card.scss";

const Card = ({
  card,
  isJudge,
  socket,
  isPlayerJudge,
  playedCardArea,
  canJudgePick,
  deckSize,
  winningCard,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const playCard = (card) => {
    socket?.emit("playCard", {
      cardToPlay: card,
    });
  };

  const judgePickedCard = (card) => {
    console.log(card);
    socket.emit("judgePickedCard", {
      judgePickedCard: card,
    });
  };

  useEffect(() => {
    console.log("canJudgePick", canJudgePick);
    if ((isPlayerJudge && playedCardArea) || canJudgePick) {
      setIsFlipped(true);
    }
    if (!isPlayerJudge && !playedCardArea) {
      setIsFlipped(true);
    }

    if (!playedCardArea && isPlayerJudge) {
      setIsFlipped(false);
    }
    if (playedCardArea && !isPlayerJudge && deckSize !== 3) {
      setIsFlipped(false);
    }
  }, [canJudgePick, playedCardArea, isPlayerJudge, deckSize]);

  console.log("card: %O\nwinningCard: %O\n", card, winningCard);

  return (
    <div class={isJudge ? "judge scene scene--card" : "scene scene--card"}>
      <div
        class={!isFlipped ? "card" : "card is-flipped"}
        onClick={() => {
          if (playedCardArea && isPlayerJudge && canJudgePick) {
            judgePickedCard(card);
          } else {
            !isPlayerJudge && playCard(card);
          }
        }}
        //setIsFlipped(!isFlipped)}
      >
        <div class="card__face card__face--front">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="64"
            width="62"
            viewBox="0 0 496 512"
          >
            {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--> */}
            <path
              opacity="1"
              fill={isJudge ? "#7c0202" : "#1E3050"}
              d="M490 241.7C417.1 169 320.6 71.8 248.5 0 83 164.9 6 241.7 6 241.7c-7.9 7.9-7.9 20.7 0 28.7C138.8 402.7 67.8 331.9 248.5 512c379.4-378 15.7-16.7 241.5-241.7 8-7.9 8-20.7 0-28.6zm-241.5 90l-76-75.7 76-75.7 76 75.7-76 75.7z"
            />
          </svg>
        </div>
        <div
          class={
            playedCardArea &&
            winningCard?.playerSocketId &&
            winningCard?.playerSocketId !== card?.playerSocketId
              ? "card__face card__face--back losing-cards"
              : "card__face card__face--back"
          }
        >
          <h3>{card.type}</h3>
          <p>{card.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
