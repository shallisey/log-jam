import React, { useState } from "react";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import "./GameInfo.scss";

const GameInfo = () => {
  const [playerInfo, setPlayerInfo] = useState([
    { name: "lucy", wins: 0 },
    { name: null, wins: 0 },
    { name: null, wins: 0 },
    { name: null, wins: 0 },
  ]);

  return (
    <div className="game-info">
      <h1>Hello World I'm LogJam!</h1>
      {playerInfo &&
        playerInfo.map((player, i) => (
          <PlayerInfo
            name={player.name || null}
            wins={player.wins || 0}
            i={i}
          />
        ))}
    </div>
  );
};

export default GameInfo;
