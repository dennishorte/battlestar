module.exports = {
  id: "piggy-bank-e027",
  name: "Piggy Bank",
  deck: "minorE",
  number: 27,
  type: "minor",
  cost: {},
  text: "At the end of each work phase, you can place 1 food on this card, irretrievably. At any time, you can discard 6 food from this card to build a major improvement at no cost.",
  storedResource: "food",
  enablesFreeMajor: { cost: 6 },
  onWorkPhaseEnd(game, player) {
    if (player.food >= 1) {
      const selection = game.actions.choose(player, [
        'Store 1 food on Piggy Bank',
        'Skip',
      ], {
        title: 'Piggy Bank',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 1 })
        const s = game.cardState(this.id)
        s.stored = (s.stored || 0) + 1
        game.log.add({
          template: '{player} stores 1 food on {card} ({amount} total)',
          args: { player, card: this, amount: s.stored },
        })
      }
    }
  },
}
