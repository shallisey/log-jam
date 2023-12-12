import React, { useState } from "react";
import "./PlayerInfo.scss";

const PlayerInfo = ({ name, wins, i }) => {
  return (
    <div className="player-info">
      {name ? (
        <>
          <h3>
            Player {i + 1} has joined - {name}
          </h3>
          <div>Wins: {wins}</div>
        </>
      ) : (
        <h3>Waiting for player {i + 1}</h3>
      )}
    </div>
  );
};

export default PlayerInfo;
