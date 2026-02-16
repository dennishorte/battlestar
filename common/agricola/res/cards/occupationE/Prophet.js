module.exports = {
  id: "prophet-e094",
  name: "Prophet",
  deck: "occupationE",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "When you play this card, immediately take a \"Renovation\" action. Afterward, you can take a \"Build Fences\" action. (Both actions require their usual cost.)",
  onPlay(game, player) {
    game.actions.offerRenovation(player, this)
    // Offer build fences if player has wood
    if (player.wood >= 1 || player.getFreeFenceCount() > 0) {
      game.actions.buildFences(player)
    }
  },
}
