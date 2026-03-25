module.exports = {
  id: "clay-deposit-c036",
  name: "Clay Deposit",
  deck: "minorC",
  number: 36,
  type: "minor",
  cost: { food: 2 },
  prereqs: { occupations: 1 },
  category: "Points Provider",
  text: "Immediately after each time you use a clay accumulation space, you can exchange 1 clay for 1 bonus point. If you do, place the clay on the accumulation space.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-clay' || actionId === 'take-clay-2'
  },
  onAction(game, player, _actionId) {
    if (player.clay >= 1) {
      const selection = game.actions.choose(player, [
        'Exchange 1 clay for 1 bonus point',
        'Skip',
      ], {
        title: 'Clay Deposit',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ clay: 1 })
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} exchanges 1 clay for 1 bonus point',
          args: { player },
        })
      }
    }
  },
}
