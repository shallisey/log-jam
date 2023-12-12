const findCardIndex = require("../utils/findCardIndex");

const MAX_CARDS_IN_HAND = 5;

class Player {
  constructor(socketId, username) {
    this.cardsInHand = []; // 5
    this.points = 0;
    this.isJudge = false;
    this.socketId = socketId;
    this.username = username;
    this.hasPlayedCardThisTurn = false;
    this.isHost = false;
  }

  setJudge(bool) {
    this.isJudge = bool;
    console.log(this.isJudge);
  }

  addCard(card) {
    this.cardsInHand.push(card);
  }

  findCardInHand(cardToFind) {
    // find the index of the card in the players hand
    // If it is not in their hand then return -1

    const indexOfCard = findCardIndex(cardToFind, this.cardsInHand);

    return indexOfCard;
  }

  removeCardAtIndex(indexOfCard) {
    this.cardsInHand.splice(indexOfCard, 1);
  }

  setHost (host) {
    this.isHost = host;
  }
}

module.exports = Player;
