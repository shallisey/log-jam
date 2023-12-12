const findCardIndex = require("../utils/findCardIndex");
const findCard = require("../utils/findCardIndex");
const getRandomInt = require("../utils/getRandomInt");

const MAX_PLAYERS = 4;

class GameState {
  constructor(deck = [], judgeDeck = [], playerInfo = []) {
    this.gamePhases = Object.freeze({
      START: "start",
      READYFORTURN: "readyforturn",
      TURN: "turn",
      GAMEOVER: "gameover",
    });
    this.playerDeck = deck;
    this.playerDiscardPile = [];
    this.judgeDeck = judgeDeck;
    this.judgeDiscardPile = [];
    this.playerInfo = [];
    this.gamePhase = null;
    this.judge = null; // this will be the players socketid
    this.judgeCard = null;
    this.indexOfJudge = 0;
    this.field = [];
    this.winner = null;
  }

  addPlayer(playerToAdd) {
    const socketId = playerToAdd.socketId;
    this.playerInfo.push(playerToAdd);
  }

  matchPlayerToSocketId(socketId) {
    return this.playerInfo.find((player) => player.socketId === socketId);
  }

  startTurn(socketIO) {
    // select a judge
    this.selectJudge();
    // have judge draw card

    this.drawJudgeCard();
  }

  drawJudgeCard() {
    this.judgeCard = null;
    const judge = this.matchPlayerToSocketId(this.judge);

    const card = this.judgeDeck.length - 1;
    this.judgeCard = this.judgeDeck[card];
    this.removeCardFromDeck(this.judgeDeck);
  }

  removeCardFromDeck(deck) {
    deck.pop();
  }

  selectJudge() {
    this.judge = null;
    // remove judgeBoolean from player

    const numberOfPlayers = this.playerInfo.length;

    const newJudge = this.playerInfo[this.indexOfJudge];

    // CHANGING PLAYER STATE
    // TODO: potentially move this out
    newJudge.setJudge(true);

    this.judge = newJudge.socketId;
  }

  playToField(card) {
    this.field.push(card);
  }

  findCardInDeck(cardToFind, deck) {
    // pass the card you want to find and the deck you want to look in
    // find the index of the card in in a deck
    // If the card is not in the deck return -1

    const indexOfCard = findCardIndex(cardToFind, deck);
    return indexOfCard;
  }

  haveAllPlayersPlayed() {
    for (let index = 0; index < this.playerInfo.length; index++) {
      const player = this.playerInfo[index];
      if (player.isJudge) {
        continue;
      }

      if (!player.hasPlayedCardThisTurn) {
        return false;
      }
    }

    return true;
  }

  discard() {
    // discard field
    this.playerDiscardPile.push(...this.field);
    this.field = [];

    // discard judge card
    this.judgeDiscardPile.push(this.judgeCard);
    this.judgeCard = null;
  }

  sendFieldCardsToEveryone(socketIO) {
    // send everyone the updated field cards
    socketIO.emit("fieldCardsUpdate", this.field);
  }

  playCard() {}

  pickWinner() {}

  removeCardFromDeck(deck) {
    deck.pop();
  }

  deckDraw() {
    for (let cardsDealt = 0; cardsDealt < 5; cardsDealt++)
      this.playerInfo.forEach((player) => {
        let drawCard = this.playerDeck.length - 1;
        player.addCard(this.playerDeck[drawCard]);
        this.removeCardFromDeck(this.playerDeck);
      });
  }

  getPlayers() {
    return this.playerInfo;
  }

  checkIfWinner() {
    const pointsToWin = 2;

    for (let index = 0; index < this.playerInfo.length; index++) {
      const player = this.playerInfo[index];

      if (player.points === pointsToWin) {
        this.winner = player;
        return true;
      }
    }

    return false;
  }
  shuffleDeck(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  startGame() {
    if (true) {
      this.gamePhase = this.gamePhases.START;
      this.playerDeck = this.shuffleDeck(this.playerDeck);
      this.judgeDeck = this.shuffleDeck(this.judgeDeck);
      this.deckDraw();
      console.log("CARDS IN HAND \n\n\n\n\n", this.playerInfo[0].cardsInHand);
    } else {
      //error out that game size isn't correct
    }
  }
}

module.exports = GameState;
