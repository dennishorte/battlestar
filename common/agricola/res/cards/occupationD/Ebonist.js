module.exports = {
  id: "ebonist-d155",
  name: "Ebonist",
  deck: "occupationD",
  number: 155,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to turn exactly 1 wood into 1 food and 1 grain.",
  onHarvest(game, player) {
    if (player.wood >= 1) {
      game.actions.offerEbonistConversion(player, this)
    }
  },
}
