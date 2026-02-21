module.exports = {
  id: "small-trader-a109",
  name: "Small Trader",
  deck: "occupationA",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Major or Minor Improvement\" action to play an improvement from your hand, you also get 3 food.",
  onBuildImprovement(game, player, cost, card) {
    // Minor improvements are always played from hand
    if (card.type === 'minor') {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
