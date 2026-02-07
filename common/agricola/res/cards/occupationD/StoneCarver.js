module.exports = {
  id: "stone-carver-d108",
  name: "Stone Carver",
  deck: "occupationD",
  number: 108,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to turn exactly 1 stone into 3 food.",
  onHarvest(game, player) {
    if (player.stone >= 1) {
      game.actions.offerStoneCarverConversion(player, this)
    }
  },
}
