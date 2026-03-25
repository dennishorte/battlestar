module.exports = {
  id: "paintbrush-e039",
  name: "Paintbrush",
  deck: "minorE",
  number: 39,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { boar: 1 },
  text: "Each harvest, you can exchange exactly 1 clay for your choice of 2 food or 1 bonus point.",
  matches_onHarvest(_game, player) {
    return player.clay >= 1
  },
  onHarvest(game, player) {
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
        template: '{player} exchanges 1 clay for 2 food',
        args: { player },
      })
    }
    else if (selection[0] === 'Pay 1 clay for 1 bonus point') {
      player.payCost({ clay: 1 })
      player.addBonusPoints(1)
      game.log.add({
        template: '{player} exchanges 1 clay for 1 bonus point',
        args: { player },
      })
    }
  },
}
