module.exports = {
  id: "bread-paddle-b025",
  name: "Bread Paddle",
  deck: "minorB",
  number: 25,
  type: "minor",
  cost: { wood: 1 },
  category: "Actions Booster",
  text: "When you play this card, you immediately get 1 food. For each occupation you play, you get an additional \"Bake Bread\" action.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from {card}',
      args: { player , card: this},
    })
  },
  onPlayOccupation(game, player) {
    game.log.add({
      template: '{player} gets an additional Bake Bread action from {card}',
      args: { player , card: this},
    })
    game.actions.bakeBread(player)
  },
}
