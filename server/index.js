const express = require("express");
const app = express();
const PORT = 4000;

//New imports
const http = require("http").Server(app);
const cors = require("cors");
const GameState = require("./classes/GameState");
const Player = require("./classes/Player");
const judgeDeck = require("./Decks/judgeDeck");
const deck = require("./Decks/deck");

app.use(cors());

let gameState = new GameState(deck, judgeDeck);
//console.log("gameState", gameState);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  gameState.addPlayer(new Player(socket.id, "new name"));
  gameState.playerInfo[0].setHost(true);

  socket.on("newPlayer", (data) => {
    gameState.addPlayer(new Player(socket.id, "new name"));
  });

  socket.on("startTurn", () => {
    // gameState.startTurn();
    // console.log("gamestate after judge selection", gameState);
    // socketIO.emit("judgeCard", {
    //   judgeCard: gameState.judgeCard,
    //   judge: gameState.judge,
    // });
    // // loop through the players and send them their info
    // gameState.playerInfo.forEach((player, idx) => {
    //   if (player.cardsInHand.length !== 0) {
    //     socketIO.to(player.socketId).emit("playerCards", {
    //       cards: player.cardsInHand,
    //       socketId: player.socketId,
    //     });
    //   }
    // });
    // socketIO.emit("startTurnResponse", `starting the game for ${socket.id}`);
  });

  socket.on("playCard", (data) => {
    const { cardToPlay } = data;

    const player = gameState.matchPlayerToSocketId(socket.id);

    // Check if player can play this turn
    if (player.hasPlayedCardThisTurn) {
      socket.emit("playCardResponse", {
        playedCard: false,
        message: "You have played a card already this turn",
      });
      return;
    }

    // TODO: add the card that was passed to the 'field'

    // remove card from users hand
    const indexOfCardInPlayersHand = player.findCardInHand(cardToPlay);
    if (indexOfCardInPlayersHand === -1) {
      console.log(
        "SOMETHING WENT WRONG TRYING TO FIND THE CARD IN PLAYERS HAND THAT THEY TRIED TO PLAY"
      );
      console.log("card to remove", data);
      console.log(
        `Cards currently in ${player.username} hand: [${player.cardsInHand}]`
      );

      socket.emit("playCardResponse", {
        playedCard: false,
        message: `The card: ${cardToPlay} was not found in your hand`,
      });

      return;
    }

    player.removeCardAtIndex(indexOfCardInPlayersHand);

    // send to player that played their new hand
    socket.emit("playerCards", {
      cards: player.cardsInHand,
      socketId: player.socketId,
    });

    gameState.playToField({
      ...cardToPlay,
      username: player.username,
      playerSocketId: player.socketId,
    });

    gameState.sendFieldCardsToEveryone(socketIO);

    // send a response to user that that succesfully played their card
    socket.emit("playCardResponse", {
      playedCard: true,
      message: "successuflly played card",
    });

    player.hasPlayedCardThisTurn = true;

    // check if all users have played a card
    if (gameState.haveAllPlayersPlayed()) {
      // emit to judge that they can now begin picking cards
      socketIO.to(gameState.judge).emit("judgeCanPick", true);
    }
  });

  socket.on("judgePickedCard", (data) => {
    const { judgePickedCard } = data;
    const player = gameState.matchPlayerToSocketId(
      judgePickedCard.playerSocketId
    );

    // check the card that the judge picked is actually in the field
    const indexOfCard = gameState.findCardInDeck(
      judgePickedCard,
      gameState.field
    );
    if (indexOfCard === -1) {
      console.log(
        "SOMETHING WENT WRONG TRYING TO FIND THE CARD IN FIELD THAT THE JUDGE PICKED THAT THEY TRIED TO PLAY"
      );
      console.log(
        `Judge picked card: ${judgePickedCard} \nCards currently on the field: ${gameState.field}`
      );
      socket.emit("judgePickedCardResponse", {
        pickedCard: false,
        message: "Judge picked card was not found on server",
      });

      return;
    }

    //update player points
    player.points += 1;

    socket.emit("judgePickedCardResponse", {
      pickedCard: true,
      message: "Judge picked card was found",
    });

    if (gameState.checkIfWinner()) {
      socketIO.emit("WINNER_FOUND", {
        winnningPlayer: { ...gameState.winner },
      });
      return;
    }
    setTimeout(() => {
      // THIS IS WHERE THE END TURN LOGIC STARTS

      // gameState.endTurn(socketIO);
      gameState.discard();
      //gameState.checkIfWinner

      // remove judge, card and update judge index
      const judge = gameState.matchPlayerToSocketId(gameState.judge);
      judge.isJudge = false;
      gameState.judge = null;
      gameState.judgeCard = null;
      gameState.indexOfJudge += 1;
      if (gameState.indexOfJudge > gameState.playerInfo.length - 1) {
        gameState.indexOfJudge = 0;
      }

      console.log("gameState after judge update", gameState);

      // deal one card to each player
      for (let index = 0; index < gameState.playerInfo.length; index++) {
        const player = gameState.playerInfo[index];
        player.hasPlayedCardThisTurn = false;
        if (player.isJudge) {
          continue;
        }

        // add card to player hand
        if (player.cardsInHand.length < 5) {
          // draw card from deck
          const card = gameState.playerDeck[gameState.playerDeck.length - 1];
          gameState.removeCardFromDeck(gameState.playerDeck);
          player.cardsInHand.push(card);
        }

        // send updated cards to player
        // socketIO.to(player.socketId).emit("playerCards", {
        //   cards: player.cardsInHand,
        //   socketId: player.socketId,
        // });
      }
      socketIO.emit("fieldCardsUpdate", gameState.field);
      startTheTurn();
    }, 2000);

    // sending updated field
  });

  socket.on("endTurn", () => {});

  socket.on("startGame", (data) => {
    console.log("game has started");
    gameState.startGame();
    console.log(gameState);

    socketIO.emit("gameStarted");
    setTimeout(() => {
      startTheTurn();
    }, 5000);
  });

  socket.on("endGame", (data) => {
    console.log("game has ended");
    endGame(gameState);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

const getAllConnectedSocketIds = () => {
  const connectedSocketMap = socketIO.sockets.adapter.sids;
  const connectedPlayers = [];

  connectedSocketMap.forEach((value, key, map) => {
    connectedPlayers.push(key);
  });

  return connectedPlayers;
};

const endGame = async (myGameState) => {
  delete myGameState;
  const players = getAllConnectedSocketIds();
  const newGameState = new GameState(deck, judgeDeck);
  players.forEach((player) => {
    newGameState.addPlayer(new Player(player, "new name"));
  });

  gameState = newGameState;

  console.log(gameState);
};

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const startTheTurn = () => {
  gameState.startTurn();

  console.log("gamestate after judge selection", gameState);

  socketIO.emit("judgeCard", {
    judgeCard: gameState.judgeCard,
    judge: gameState.judge,
  });

  // loop through the players and send them their info
  gameState.playerInfo.forEach((player, idx) => {
    if (player.cardsInHand.length !== 0) {
      socketIO.to(player.socketId).emit("playerCards", {
        cards: player.cardsInHand,
        socketId: player.socketId,
      });
    }
  });
};
