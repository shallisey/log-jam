import React from "react";
import Card from "../Card/Card";

const Deck = ({
  myCards,
  socket,
  isPlayerJudge,
  playedCardArea,
  canJudgePick,
}) => {
  return (
    <div>
      {myCards?.map((card) => (
        <Card
          card={card}
          deckSize={myCards.length}
          socket={socket}
          isPlayerJudge={isPlayerJudge}
          playedCardArea={playedCardArea}
          canJudgePick={
            canJudgePick || (myCards.length === 3 && playedCardArea)
          }
        />
      ))}
    </div>
  );
};

export default Deck;
