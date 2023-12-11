class Player {
  constructor(socketId, username) {
    this.cardsInHand = [];
    this.points = 0;
    this.isJudge = false;
    this.socketId = socketId;
    this.username = username;
    this.hasPlayedCardThisTurn;
  }

  setJudge(bool) {
    this.isJudge = bool;
    console.log(this.isJudge);
  }
}

module.exports = Player;