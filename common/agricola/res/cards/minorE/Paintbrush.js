module.exports = {
  id: "paintbrush-e039",
  name: "Paintbrush",
  deck: "minorE",
  number: 39,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { boar: 1 },
  text: "Each harvest, you can exchange exactly 1 clay for your choice of 2 food or 1 bonus point.",
  onHarvest(game, player) {
    if (player.clay >= 1) {
      const selection = game.actions.choose(player, [
        'Pay 1 clay for 2 food',
        'Pay 1 clay for 1 bonus point',
        'Skip',
      ], {
        title: 'Paintbrush',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Pay 1 clay for 2 food') {
        player.payCost({ clay: 1 })
        player.addResource('food', 2)
        game.log.add({
          template: '{player} exchanges 1 clay for 2 food using {card}',
          args: { player, card: this },
        })
      }
      else if (selection[0] === 'Pay 1 clay for 1 bonus point') {
        player.payCost({ clay: 1 })
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} exchanges 1 clay for 1 bonus point using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
