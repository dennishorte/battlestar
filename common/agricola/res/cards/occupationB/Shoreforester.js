module.exports = {
  id: "shoreforester-b116",
  name: "Shoreforester",
  deck: "occupationB",
  number: 116,
  type: "occupation",
  players: "1+",
  text: "When you play this card, and each time 1 reed is placed on an empty \"Reed Bank\" accumulation space in the preparation phase, you get 1 wood.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Shoreforester',
      args: { player },
    })
  },
  onReedBankReplenish(game, player, wasNonEmpty) {
    if (!wasNonEmpty) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Shoreforester',
        args: { player },
      })
    }
  },
}
