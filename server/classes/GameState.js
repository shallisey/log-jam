class GameState {
  constructor(deck = [], judgeDeck = [], playerInfo = []) {
    this.playerDeck = deck;
    this.playerDiscardPile = [];
    this.judgeDeck = judgeDeck;
    this.judgeDiscardPile = [];
    this.playerInfo = [];
    this.gamePhase = // todo figure out phase of game
  }

  addPlayer(playerToAdd) {
    const socketId = playerToAdd.socketId;
    this.playerInfo.push(playerToAdd);
  }

  matchPlayerToSocketId(socketId) {
    return this.playerInfo.find((player) => player.socketId === socketId);
  }

  startTurn() {
    this.matchPlayerToSocketId(this.playerInfo[0].socketId).setJudge(true);
  }

  endTurn() {}

  playCard() {}

  pickWinner() {}

  shuffleDeck(deck) {}

  checkIfWinner() {}

  startGame() {}

  endGame() {}


}

module.exports = GameState;
