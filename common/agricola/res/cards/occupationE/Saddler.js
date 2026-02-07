module.exports = {
  id: "saddler-e128",
  name: "Saddler",
  deck: "occupationE",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Each time after you build a major improvement, you can pay 1 food to plow 1 field.",
  onBuildMajor(game, player) {
    if (player.food >= 1) {
      game.actions.offerPlowForFood(player, this)
    }
  },
}
