module.exports = {
  id: "beer-tent-operator-d133",
  name: "Beer Tent Operator",
  deck: "occupationD",
  number: 133,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, you can use this card to turn 1 wood plus 1 grain into 1 bonus point and 2 food.",
  onFeedingPhase(game, player) {
    if (player.wood >= 1 && player.grain >= 1) {
      const choices = ['Convert 1 wood + 1 grain to 1 point + 2 food', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: 'Beer Tent Operator',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.wood -= 1
        player.grain -= 1
        player.bonusPoints = (player.bonusPoints || 0) + 1
        player.addResource('food', 2)
        game.log.add({
          template: '{player} converts 1 wood + 1 grain to 1 point + 2 food (Beer Tent Operator)',
          args: { player },
        })
      }
    }
  },
}
