module.exports = {
  id: "skillful-renovator-c119",
  name: "Skillful Renovator",
  deck: "occupationC",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood and 1 clay. Each time after you renovate, you get a number of wood equal to the number of people you placed that round.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    player.addResource('clay', 1)
    game.log.add({
      template: '{player} gets 1 wood and 1 clay from Skillful Renovator',
      args: { player },
    })
  },
  onRenovate(game, player) {
    const peoplePlaced = player.getPersonPlacedThisRound()
    if (peoplePlaced > 0) {
      player.addResource('wood', peoplePlaced)
      game.log.add({
        template: '{player} gets {amount} wood from Skillful Renovator',
        args: { player, amount: peoplePlaced },
      })
    }
  },
}
