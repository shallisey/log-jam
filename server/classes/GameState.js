class GameState {
  constructor(deck = [], judgeDeck = [], playerInfo = []) {
    this.playerDeck = deck;
    this.playerDiscardPile = [];
    this.judgeDeck = judgeDeck;
    this.judgeDiscardPile = [];
    this.playerInfo = [];
    this.gamePhase = {};
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

  endTurn() { }

  playCard() { }

  pickWinner() { }

  removeCardFromDeck(deck) {
    deck.pop();
  }

  deckDraw() {
    for (let cardsDealt = 0; cardsDealt < 5; cardsDealt++)
      this.playerInfo.forEach((player) => {
        let drawCard = this.playerDeck.length - 1;
        player.addCard(this.playerDeck[drawCard]);
        this.removeCardFromDeck(this.playerDeck);
      })
  }

  dealPlayerDeck() {

  }

  getPlayers() {
    return this.playerInfo;
  }

  shuffleDeck(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  checkIfWinner() { }



  endGame() { }
  startGame() {
    if (true) {
      this.deck = this.shuffleDeck(this.playerDeck);
      this.judgeDeck = this.shuffleDeck(this.judgeDeck);
      this.deckDraw();
      console.log("CARDS IN HAND \n\n\n\n\n", this.playerInfo[0].cardsInHand);
    }
    else {
      //error out that game size isn't correct
    }
  }

}

module.exports = GameState;
