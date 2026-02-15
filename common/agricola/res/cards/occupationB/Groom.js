module.exports = {
  id: "groom-b089",
  name: "Groom",
  deck: "occupationB",
  number: 89,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood. Once you live in a stone house, at the start of each round, you can build exactly 1 stable for 1 wood.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Groom',
      args: { player },
    })
  },
  onRoundStart(game, player) {
    if (player.roomType === 'stone' && player.wood >= 1) {
      game.actions.offerBuildStableForWood(player, this)
    }
  },
}
