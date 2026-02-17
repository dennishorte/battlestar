module.exports = {
  id: "bucksaw-a037",
  name: "Bucksaw",
  deck: "minorA",
  number: 37,
  type: "minor",
  cost: { wood: 1 },
  category: "Points Provider",
  text: "Each time you renovate, you can also pay 1 wood to get 1 bonus point and 1 grain.",
  onRenovate(game, player) {
    if (player.wood >= 1) {
      const card = this
      const choices = [
        'Pay 1 wood for 1 grain and 1 bonus point',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Pay wood for grain and bonus point?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 1 })
        player.addResource('grain', 1)
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} pays 1 wood for 1 grain and 1 bonus point using {card}',
          args: { player, card },
        })
      }
    }
  },
}
