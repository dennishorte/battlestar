module.exports = {
  id: "soil-scientist-c114",
  name: "Soil Scientist",
  deck: "occupationC",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "Each time after you use a clay/stone accumulation space, you can place 1 stone/2 clay from your supply on the space to get 2 grain/1 vegetable, respectively.",
  onAction(game, player, actionId) {
    if ((actionId === 'take-clay' || actionId === 'take-clay-2') && player.stone >= 1) {
      game.actions.offerSoilScientistExchange(player, this, 'stone', 1, 'grain', 2, actionId)
    }
    else if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && player.clay >= 2) {
      game.actions.offerSoilScientistExchange(player, this, 'clay', 2, 'vegetables', 1, actionId)
    }
  },
}
