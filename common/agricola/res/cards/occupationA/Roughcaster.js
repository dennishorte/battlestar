module.exports = {
  id: "roughcaster-a110",
  name: "Roughcaster",
  deck: "occupationA",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "Each time you build at least 1 clay room or renovate your house from clay to stone, you also get 3 food.",
  onBuildRoom(game, player, roomType) {
    if (roomType === 'clay') {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from Roughcaster',
        args: { player },
      })
    }
  },
  onRenovate(game, player, fromType, toType) {
    if (fromType === 'clay' && toType === 'stone') {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from Roughcaster',
        args: { player },
      })
    }
  },
}
