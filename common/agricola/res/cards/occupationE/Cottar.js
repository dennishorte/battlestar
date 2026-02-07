module.exports = {
  id: "cottar-e122",
  name: "Cottar",
  deck: "occupationE",
  number: 122,
  type: "occupation",
  players: "1+",
  text: "Each time you play or build an improvement, you get your choice of 1 wood or 1 clay immediately after paying its cost.",
  onPlayImprovement(game, player) {
    game.actions.offerWoodOrClay(player, this)
  },
  onBuildImprovement(game, player) {
    game.actions.offerWoodOrClay(player, this)
  },
}
