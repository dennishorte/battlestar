module.exports = {
  id: "market-crier-c142",
  name: "Market Crier",
  deck: "occupationC",
  number: 142,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Grain Seeds\" action space, you can get an additional 1 grain and 1 vegetable. If you do, each other player gets 1 grain from the general supply.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      game.actions.offerMarketCrierBonus(player, this)
    }
  },
}
