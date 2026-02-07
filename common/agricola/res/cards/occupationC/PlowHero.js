module.exports = {
  id: "plow-hero-c091",
  name: "Plow Hero",
  deck: "occupationC",
  number: 91,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Farmland\" or \"Cultivation\" action space with the first person you place in a round, you can plow 1 additional field for 1 food.",
  onAction(game, player, actionId) {
    if ((actionId === 'plow-field' || actionId === 'plow-sow') && player.getPersonPlacedThisRound() === 1) {
      if (player.food >= 1) {
        game.offerPlowForFood(player, this)
      }
    }
  },
}
