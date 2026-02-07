module.exports = {
  id: "pulverizer-plow-d019",
  name: "Pulverizer Plow",
  deck: "minorD",
  number: 19,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 1 },
  category: "Farm Planner",
  text: "Immediately after each time you use a clay accumulation space, you can pay 1 clay to plow 1 field. If you do, place that 1 clay on the accumulation space.",
  onAction(game, player, actionId) {
    if ((actionId === 'take-clay' || actionId === 'take-clay-2') && player.clay >= 1) {
      game.actions.offerPulverizerPlow(player, this, actionId)
    }
  },
}
