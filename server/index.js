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

const gameState = new GameState(deck, judgeDeck);
console.log("gameState", gameState);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  gameState.addPlayer(new Player(socket.id, "new name"));

  socket.on("newPlayer", (data) => {});

  socket.on("startTurn", () => {
    gameState.startTurn();

    // send the judge card to everyone
    socketIO.emit("judgeCard", {
      judgeCard: gameState.judgeCard,
      judge: gameState.judge,
    });

    // loop through the players and send them their info
    gameState.playerInfo.forEach((player, idx) => {
      // TODO: Actually have cards to send
      const cards = [deck[idx], deck[idx + 2]];
      // TODO: REMOVE THIS BECAUSE CARDS SHOULD ALREADY BE IN HAND
      player.cardsInHand = cards;
      socketIO.to(player.socketId).emit("playerCards", {
        cards: player.cardsInHand,
        socketId: player.socketId,
      });
    });

    socketIO.emit("startTurnResponse", `starting the game for ${socket.id}`);
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

    // send everyone the updated field cards
    socketIO.emit("fieldCardsUpdate", gameState.field);

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

    //update player win count that was chosen
    player.points += 1;

    // loop through all players that are not the judge and deal them one card
    // TODO: look at how cards are being dealt

    // move cards from field to discard pile
    gameState.discard();

    socket.emit("judgePickedCardResponse", {
      pickedCard: true,
      message: "Judge picked card was found",
    });

    // Check if there is a winner
    if (gameState.checkIfWinner()) {
      socketIO.emit("WINNER_FOUND", {
        winnningPlayer: { ...gameState.winner },
      });
    }

    // TODO: send updated decks, hands, and discard piles
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
