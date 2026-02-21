module.exports = {
  id: "recluse-e111",
  name: "Recluse",
  deck: "occupationE",
  number: 111,
  type: "occupation",
  players: "1+",
  text: "As long as you have no minor improvements in front of you, you get 1 food at the start of each round and 1 wood at the start of each harvest.",
  onRoundStart(game, player) {
    if (player.playedMinorImprovements.length === 0) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
  onHarvestStart(game, player) {
    if (player.playedMinorImprovements.length === 0) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
