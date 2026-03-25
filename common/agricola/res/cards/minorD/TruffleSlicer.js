module.exports = {
  id: "truffle-slicer-d039",
  name: "Truffle Slicer",
  deck: "minorD",
  number: 39,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { minRound: 8 },
  category: "Points Provider",
  text: "Each time you use a wood accumulation space, if you have at least 1 wild boar, you can pay 1 food for 1 bonus point.",
  matches_onAction(game, player, actionId) {
    return game.isWoodAccumulationSpace(actionId)
  },
  onAction(game, player, _actionId) {
    if (player.getTotalAnimals('boar') < 1 || player.food < 1) {
      return
    }

    const selection = game.actions.choose(player, [
      'Pay 1 food for 1 bonus point',
      'Skip',
    ], {
      title: 'Truffle Slicer',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      player.payCost({ food: 1 })
      player.addBonusPoints(1)
      game.log.add({
        template: '{player} pays 1 food for 1 bonus point',
        args: { player },
      })
    }
  },
}
