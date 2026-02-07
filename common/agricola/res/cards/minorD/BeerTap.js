module.exports = {
  id: "beer-tap-d062",
  name: "Beer Tap",
  deck: "minorD",
  number: 62,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "When you play this card, you immediately get 2 food. In the feeding phase of each harvest, you can turn 2/3/4 grain into 3/6/9 food.",
  onPlay(game, player) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 food from Beer Tap',
      args: { player },
    })
  },
  onFeedingPhase(game, player) {
    if (player.grain >= 2) {
      game.actions.offerBeerTap(player, this)
    }
  },
}
