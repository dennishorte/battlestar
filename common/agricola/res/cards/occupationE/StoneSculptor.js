module.exports = {
  id: "stone-sculptor-e153",
  name: "Stone Sculptor",
  deck: "occupationE",
  number: 153,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to exchange exactly 1 stone for 1 bonus point and 1 food.",
  onHarvest(game, player) {
    if (player.stone >= 1) {
      game.actions.offerStoneSculptorConversion(player, this)
    }
  },
}
