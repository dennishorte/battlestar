module.exports = {
  id: "plow-driver-a090",
  name: "Plow Driver",
  deck: "occupationA",
  number: 90,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, at the start of each round, you can pay 1 food to plow 1 field.",
  onRoundStart(game, player) {
    if (player.roomType === 'stone' && (player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0)) {
      game.offerPlowForFood(player, this)
    }
  },
}
