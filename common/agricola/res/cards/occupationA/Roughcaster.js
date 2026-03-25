module.exports = {
  id: "roughcaster-a110",
  name: "Roughcaster",
  deck: "occupationA",
  number: 110,
  type: "occupation",
  players: "1+",
  text: "Each time you build at least 1 clay room or renovate your house from clay to stone, you also get 3 food.",
  matches_onBuildRoom(_game, _player, roomType) {
    return roomType === 'clay'
  },
  onBuildRoom(game, player, _roomType) {
    player.addResource('food', 3)
    game.log.add({
      template: '{player} gets 3 food',
      args: { player },
    })
  },
  matches_onRenovate(_game, _player, fromType, toType) {
    return fromType === 'clay' && toType === 'stone'
  },
  onRenovate(game, player, _fromType, _toType) {
    player.addResource('food', 3)
    game.log.add({
      template: '{player} gets 3 food',
      args: { player },
    })
  },
}
