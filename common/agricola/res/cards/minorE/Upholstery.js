module.exports = {
  id: "upholstery-e031",
  name: "Upholstery",
  deck: "minorE",
  number: 31,
  type: "minor",
  cost: {},
  text: "Each time you build or play an improvement after this one, you can place 1 reed on this card, irretrievably, to get 1 bonus point, up to the number of rooms in your house.",
  storedResource: "reed",
  onBuildImprovement(game, player, cost, card) {
    if (card && card.id !== this.id) {
      const stored = game.cardState(this.id).stored || 0
      if (stored < player.getRoomCount() && player.reed >= 1) {
        const selection = game.actions.choose(player, [
          'Store 1 reed for 1 bonus point',
          'Skip',
        ], {
          title: 'Upholstery',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          player.payCost({ reed: 1 })
          const s = game.cardState(this.id)
          s.stored = (s.stored || 0) + 1
          game.log.add({
            template: '{player} stores 1 reed on {card} for 1 bonus point ({amount} total)',
            args: { player, card: this, amount: s.stored },
          })
        }
      }
    }
  },
  getEndGamePoints(_player, game) {
    return game.cardState(this.id).stored || 0
  },
}
