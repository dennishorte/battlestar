module.exports = {
  id: "ale-benches-a029",
  name: "Ale-Benches",
  deck: "minorA",
  number: 29,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "In the returning home phase of each round, you can pay exactly 1 grain from your supply to get 1 bonus point. If you do, each other player gets 1 food.",
  onReturnHome(game, player) {
    if (player.grain >= 1) {
      game.actions.offerAleBenches(player, this)
    }
  },
}
