module.exports = {
  id: "bale-of-straw-d061",
  name: "Bale of Straw",
  deck: "minorD",
  number: 61,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "At the start of each harvest, if you have at least 3 grain fields (including field cards with planted grain), you get 2 food.",
  matches_onHarvestStart(_game, player) {
    return player.getGrainFieldCount() >= 3
  },
  onHarvestStart(game, player) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 food from {card}',
      args: { player , card: this},
    })
  },
}
