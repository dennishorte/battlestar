module.exports = {
  id: "comb-and-cutter-e059",
  name: "Comb and Cutter",
  deck: "minorE",
  number: 59,
  type: "minor",
  cost: { wood: 1 },
  text: "Each time you use the \"Day Laborer\" action space, you get 1 additional food for each sheep on the \"Sheep Market\" accumulation space, up to a maximum of 4 additional food.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      const sheepOnMarket = game.getAccumulatedResources('take-sheep').sheep || 0
      const bonus = Math.min(sheepOnMarket, 4)
      if (bonus > 0) {
        player.addResource('food', bonus)
        game.log.add({
          template: '{player} gets {amount} bonus food from Comb and Cutter',
          args: { player, amount: bonus },
        })
      }
    }
  },
}
