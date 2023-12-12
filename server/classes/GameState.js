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

    socketIO.emit("judgeCard", {
      judgeCard: this.judgeCard,
      judge: this.judge,
    });
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

  endTurn(socketIO) {
    //update player hands

    //  discard cards
    // move cards from field to discard pile
    this.discard();
    //this.checkIfWinner
    if (this.checkIfWinner()) {
      socketIO.emit("WINNER_FOUND", {
        winnningPlayer: { ...this.winner },
      });
    }

    // cleanup (update judge info, deal to players)
    this.cleanupEndOfTurn(socketIO);
  }

  cleanupEndOfTurn(socketIO) {
    // remove judge, card and update judge index
    this.judge = null;
    this.judgeCard = null;
    this.indexOfJudge += 1;

    // deal one card to each player
    for (let index = 0; index < this.playerInfo.length; index++) {
      const player = this.playerInfo[index];
      if (player.isJudge) {
        continue;
      }

      // draw card from deck
      const card = this.playerDeck[this.playerDeck.length - 1];
      this.removeCardFromDeck(this.playerDeck);

      // add card to player hand
      player.cardsInHand = player.cardsInHand.push(card);

      // send updated cards to player
      socketIO.to(player.socketId).emit(
        ("playerCards",
        {
          cards: player.cardsInHand,
          socketId: player.socketId,
        })
      );
    }
  }

  playCard() {}

  pickWinner() {}

  shuffleDeck(deck) {}

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

  startGame() {}

  endGame() {}
}

module.exports = GameState;
