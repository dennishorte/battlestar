module.exports = {
  id: "lantern-house-c035",
  name: "Lantern House",
  deck: "minorC",
  number: 35,
  type: "minor",
  cost: { wood: 1 },
  vps: 7,
  prereqs: { noOccupations: true },
  category: "Points Provider",
  text: "During scoring, you get 1 negative point for each card left in your hand. You cannot discard cards from your hand unplayed.",
  preventsDiscard: true,
  getEndGamePoints(player) {
    const cardsInHand = player.hand.length
    return -cardsInHand
  },
}
