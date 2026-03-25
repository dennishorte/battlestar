module.exports = {
  id: "weakling-b161",
  name: "Weakling",
  deck: "occupationB",
  number: 161,
  type: "occupation",
  players: "4+",
  text: "Each time it is your turn in the work phase, if there are 1 or more accumulation spaces with 5+ goods on them and you do not use any of them, you get 1 vegetable.",
  matches_afterPlayerAction(game, _player, actionId) {
    return !game.isAccumulationSpaceWith5PlusGoods(actionId)
  },
  afterPlayerAction(game, player, _actionId) {
    if (game.hasAccumulationSpaceWithGoods(5)) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable',
        args: { player },
      })
    }
  },
}
