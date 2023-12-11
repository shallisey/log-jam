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

//console.log ("DECK", deck)

app.use(cors());

const gameState = new GameState(deck, judgeDeck);
//console.log("gameState", gameState);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  gameState.addPlayer(new Player(socket.id, "new name"));

  //console.log(gameState);

  gameState.startTurn();
 


  socket.on("startGame", (data) => {
    console.log("game has started");
    gameState.startGame();
    //console.log(gameState);

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
