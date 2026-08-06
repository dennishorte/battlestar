module.exports = {
  id: "pipe-smoker-e117",
  name: "Pipe Smoker",
  deck: "occupationE",
  number: 117,
  type: "occupation",
  players: "1+",
  text: "At the start of each harvest, if you have at least 1 grain field, you get 2 wood.",
  matches_onHarvestStart(_game, player) {
    return player.getGrainFieldCount() >= 1
  },
  onHarvestStart(game, player) {
    player.addResource('wood', 2)
    game.log.add({
      template: '{player} gets 2 wood from {card}',
      args: { player , card: this},
    })
  },
}
