import React from "react";
import Card from "../Card/Card";

const Deck = ({ myCards, socket, isPlayerJudge, playedCardArea, canJudgePick  }) => {
  return (
    <div>
      {myCards?.map((card) => (
        <Card card={card} socket={socket} isPlayerJudge={isPlayerJudge}  playedCardArea={playedCardArea} canJudgePick={canJudgePick} />
      ))}
    </div>
  );
};

export default Deck;
