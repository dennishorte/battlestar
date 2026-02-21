module.exports = {
  id: "thresher-c112",
  name: "Thresher",
  deck: "occupationC",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Immediately before each time you use the \"Grain Utilization\", \"Farmland\", or \"Cultivation\" action space, you can buy 1 grain for 1 food.",
  onBeforeAction(game, player, actionId) {
    if ((actionId === 'sow-bake' || actionId === 'plow-field' || actionId === 'plow-sow') && player.food >= 1) {
      const selection = game.actions.choose(player, () => [
        'Pay 1 food for 1 grain',
        'Do not buy grain',
      ], { title: 'Thresher', min: 1, max: 1 })
      if (selection[0] === 'Pay 1 food for 1 grain') {
        player.payCost({ food: 1 })
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} buys 1 grain for 1 food from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
