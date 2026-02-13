module.exports = {
  id: "carriage-trip-c003",
  name: "Carriage Trip",
  deck: "minorC",
  number: 3,
  type: "minor",
  cost: {},
  prereqs: { personYetToPlace: true },
  category: "Actions Booster",
  text: "If you play this card in the work phase, you can immediately place another person.",
  onPlay(game, player) {
    if (player.getAvailableWorkers() <= 0) {
      game.log.add({
        template: '{player} has no workers to place for {card}',
        args: { player, card: this },
      })
      return
    }

    game.log.add({
      template: '{player} uses {card} to place another person immediately',
      args: { player, card: this },
    })
    game.log.indent()
    game.playerTurn(player, { isBonusTurn: true })
    game.log.outdent()
  },
}
