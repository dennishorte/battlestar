module.exports = {
  id: "drill-harrow-d017",
  name: "Drill Harrow",
  deck: "minorD",
  number: 17,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Each time before you take an unconditional \"Sow\" action, you can pay 3 food to plow 1 field.",
  onBeforeSow(game, player) {
    if (player.food >= 3) {
      game.actions.offerDrillHarrow(player, this)
    }
  },
}
