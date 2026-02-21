module.exports = {
  id: "veggie-lover-e132",
  name: "Veggie Lover",
  deck: "occupationE",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "In each harvest, you can use this card to exchange a pair of 1 grain and 1 vegetable into 6 food. During scoring, you can exchange 1/2/3 pairs of 1 grain and 1 vegetable for 2/4/6 bonus points.",
  onHarvest(game, player) {
    while (player.grain >= 1 && player.vegetables >= 1) {
      const selection = game.actions.choose(player, ['Convert 1 grain + 1 vegetable to 6 food', 'Skip'], {
        title: 'Veggie Lover: Convert?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Skip') {
        break
      }
      player.removeResource('grain', 1)
      player.removeResource('vegetables', 1)
      player.addResource('food', 6)
      game.log.add({
        template: '{player} converts 1 grain + 1 vegetable to 6 food using {card}',
        args: { player , card: this},
      })
    }
  },
  getEndGamePoints(player) {
    const pairs = Math.min(player.grain, player.vegetables, 3)
    return pairs * 2
  },
}
