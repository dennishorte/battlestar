module.exports = {
  id: "seed-seller-d141",
  name: "Seed Seller",
  deck: "occupationD",
  number: 141,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 grain. Each time you use the \"Grain Seeds\" action space, you get 1 additional grain.",
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from {card}',
      args: { player , card: this},
    })
  },
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 additional grain',
      args: { player },
    })
  },
}
