module.exports = {
  id: "beer-table-c029",
  name: "Beer Table",
  deck: "minorC",
  number: 29,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { noGrain: true },
  category: "Points Provider",
  text: "At the end of the field phase of each harvest, you can pay 1 grain from your supply to get 2 bonus points. If you do, all other players get 1 food each.",
  onFieldPhaseEnd(game, player) {
    if (player.grain >= 1) {
      game.actions.offerBeerTable(player, this)
    }
  },
}
