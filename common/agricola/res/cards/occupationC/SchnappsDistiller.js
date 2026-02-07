module.exports = {
  id: "schnapps-distiller-c109",
  name: "Schnapps Distiller",
  deck: "occupationC",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, you can use this card to turn exactly 1 vegetable into 5 food.",
  onFeedingPhase(game, player) {
    if (player.vegetables >= 1) {
      game.actions.offerSchnappsDistillerConversion(player, this)
    }
  },
}
