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
  onAction(game, player, actionId) {
    if (actionId === 'take-clay' || actionId === 'take-clay-2') {
      if (player.clay >= 1) {
        game.actions.offerClayDeposit(player, this, actionId)
      }
    }
  },
}
