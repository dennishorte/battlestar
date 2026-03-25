module.exports = {
  id: "stone-company-a023",
  name: "Stone Company",
  deck: "minorA",
  number: 23,
  type: "minor",
  cost: { clay: 2, reed: 1 },
  vps: 1,
  category: "Actions Booster",
  text: "Immediately after each time you use a \"Quarry\" accumulation space, you get a \"Major or Minor Improvement\" action during which you must spend at least 1 stone.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-stone-1' || actionId === 'take-stone-2'
  },
  onAction(game, player, _actionId) {
    game.log.add({
      template: '{player} gets an improvement action',
      args: { player },
    })
    game.actions.buildImprovement(player, { requireStone: true })
  },
}
