module.exports = {
  id: "field-merchant-b103",
  name: "Field Merchant",
  deck: "occupationB",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood and 1 reed. Each time you decline a \"Minor/Major Improvement\" action, you get 1 food/vegetable instead.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    player.addResource('reed', 1)
    game.log.add({
      template: '{player} gets 1 wood and 1 reed from {card}',
      args: { player , card: this},
    })
  },
  onDeclineMinorImprovement(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from {card}',
      args: { player , card: this},
    })
  },
  onDeclineMajorImprovement(game, player) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable from {card}',
      args: { player , card: this},
    })
  },
}
