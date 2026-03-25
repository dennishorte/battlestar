module.exports = {
  id: "small-trader-a109",
  name: "Small Trader",
  deck: "occupationA",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Major or Minor Improvement\" action to play an improvement from your hand, you also get 3 food.",
  matches_onBuildImprovement(_game, _player, _cost, card) {
    // Minor improvements are always played from hand
    return card.type === 'minor'
  },
  onBuildImprovement(game, player, _cost, _card) {
    player.addResource('food', 3)
    game.log.add({
      template: '{player} gets 3 food',
      args: { player },
    })
  },
}
