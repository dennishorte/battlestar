module.exports = {
  id: "zigzag-harrow-d001",
  name: "Zigzag Harrow",
  deck: "minorD",
  number: 1,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { fieldsInLShape: true },
  category: "Farm Planner",
  text: "You can immediately plow 1 field such that it completes a \"zigzag\" pattern.",
  onPlay(game, player) {
    game.actions.plowField(player, { zigzagPattern: true })
  },
}
