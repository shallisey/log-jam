import React, { useState } from "react";

const GameInfo = ({ playerInfo, socket }) => {
  //   const [playerInfo, setPlayerInfo] = useState([
  //     { name: "lucy", wins: 0 },
  //     { name: null, wins: 0 },
  //     { name: null, wins: 0 },
  //     { name: null, wins: 0 },
  //   ]);

  return (
    <div className="game-info">
      <h1>Hello World I'm LogJam!</h1>
      {playerInfo?.map((player) => (
        <>
          <h3>Player {player.socketId}</h3>
          <div>Points: {player.points}</div>
        </>
      ))}
    </div>
  );
};

export default GameInfo;
