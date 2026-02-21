module.exports = {
  id: "hod-a077",
  name: "Hod",
  deck: "minorA",
  number: 77,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "When you play this card, you immediately get 1 clay. Each time any player (including you) uses the \"Pig Market\" accumulation space, you immediately get 2 clay.",
  onPlay(game, player) {
    player.addResource('clay', 1)
    game.log.add({
      template: '{player} gets 1 clay from {card}',
      args: { player , card: this},
    })
  },
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-boar') {
      cardOwner.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 2 clay from {card}',
        args: { player: cardOwner , card: this},
      })
    }
  },
}
