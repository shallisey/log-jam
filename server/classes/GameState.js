const findCardIndex = require("../utils/findCardIndex");
const findCard = require("../utils/findCardIndex");
const getRandomInt = require("../utils/getRandomInt");

const MAX_PLAYERS = 4;

class GameState {
  constructor(deck = [], judgeDeck = [], playerInfo = []) {
    this.playerDeck = deck;
    this.playerDiscardPile = [];
    this.judgeDeck = judgeDeck;
    this.judgeDiscardPile = [];
    this.playerInfo = [];
    this.gamePhase = null; // todo figure out phase of game
    this.judge = null; // this will be the players socketid
    this.judgeCard = null;
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

  startTurn() {
    // select a judge
    this.selectJudge();
    // have judge draw card

    this.drawJudgeCard();
    // have players draw cards up to 5 max
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
    const randomUser = getRandomInt(numberOfPlayers);

    const newJudge = this.playerInfo[randomUser];

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

  endTurn() {}

  playCard() {}

  pickWinner() {}

  shuffleDeck(deck) {}

  checkIfWinner() {
    const pointsToWin = 1;

    for (let index = 0; index < this.playerInfo.length; index++) {
      const player = this.playerInfo[index];

      if (player.points === pointsToWin) {
        this.winner = player;
        return true;
      }
    }

    return false;
  }

  startGame() {}

  endGame() {}
}

module.exports = GameState;
