module.exports = {
  id: "upholstery-e031",
  name: "Upholstery",
  deck: "minorE",
  number: 31,
  type: "minor",
  cost: {},
  text: "Each time you build or play an improvement after this one, you can place 1 reed on this card, irretrievably, to get 1 bonus point, up to the number of rooms in your house.",
  storedResource: "reed",
  onPlayImprovement(game, player, card) {
    if (card.id !== this.id) {
      const stored = this.stored || 0
      if (stored < player.getRoomCount() && player.reed >= 1) {
        game.actions.offerUpholstery(player, this)
      }
    }
  },
  getEndGamePoints() {
    return this.stored || 0
  },
}
