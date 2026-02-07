module.exports = {
  id: "stone-axe-e075",
  name: "Stone Axe",
  deck: "minorE",
  number: 75,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  text: "Each time you use a wood accumulation space, you can return 1 stone to the general supply to get an additional 3 wood.",
  onAction(game, player, actionId) {
    const woodActions = ['forest', 'grove', 'copse']
    if (woodActions.includes(actionId) && player.stone >= 1) {
      game.actions.offerStoneAxe(player, this)
    }
  },
}
