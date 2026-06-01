module.exports = {
  id: "thresher-c112",
  name: "Thresher",
  deck: "occupationC",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Immediately before each time you use the \"Grain Utilization\", \"Farmland\", or \"Cultivation\" action space, you can buy 1 grain for 1 food.",
  matches_onBeforeAction(_game, _player, actionId) {
    return actionId === 'sow-bake' || actionId === 'plow-field' || actionId === 'plow-sow'
  },
  onBeforeAction(game, player, _actionId) {
    if (player.food >= 1) {
      const selection = game.actions.choose(player, () => [
        game.actions.option({ id: 'buy', title: 'Pay 1 food for 1 grain' }),
        game.actions.option({ id: 'skip', title: 'Do not buy grain' }),
      ], { title: 'Thresher', min: 1, max: 1 })
      if (selection[0].id === 'buy') {
        player.payCost({ food: 1 })
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} buys 1 grain for 1 food',
          args: { player },
        })
      }
    }
  },
}
