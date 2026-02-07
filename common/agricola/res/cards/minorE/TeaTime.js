module.exports = {
  id: "tea-time-e003",
  name: "Tea Time",
  deck: "minorE",
  number: 3,
  type: "minor",
  cost: { food: 1 },
  prereqs: { personOnAction: "grain-utilization" },
  text: "Immediately return your person on the \"Grain Utilization\" action space home; you can place it again later this round.",
  onPlay(game, player) {
    game.actions.returnWorkerFromAction(player, 'grain-utilization')
  },
}
