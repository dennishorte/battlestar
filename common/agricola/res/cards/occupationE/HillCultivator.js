module.exports = {
  id: "hill-cultivator-e121",
  name: "Hill Cultivator",
  deck: "occupationE",
  number: 121,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Grain Seeds\" or \"Vegetable Seeds\" action space, you also get 2 or 3 clay, respectively.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain' || actionId === 'take-vegetable'
  },
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      player.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 2 clay',
        args: { player },
      })
    }
    else if (actionId === 'take-vegetable') {
      player.addResource('clay', 3)
      game.log.add({
        template: '{player} gets 3 clay',
        args: { player },
      })
    }
  },
}
