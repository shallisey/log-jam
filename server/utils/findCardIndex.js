const findCardIndex = (cardToFind, deck) => {
  // pass the card you want to find and the deck/hand you want to look in
  // find the index of the card in in a deck
  // If the card is not in the deck return -1

  const indexOfCard = deck.findIndex(
    (card) =>
      card.type === cardToFind.type && card.content === cardToFind.content
  );

  return indexOfCard;
};

module.exports = findCardIndex;
