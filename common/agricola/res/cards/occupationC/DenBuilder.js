module.exports = {
  id: "den-builder-c085",
  name: "Den Builder",
  deck: "occupationC",
  number: 85,
  type: "occupation",
  players: "1+",
  text: "When you live in a clay or stone house, you can pay 1 grain and 2 food. If you do, for the rest of the game, this card provides room for exactly one person.",
  providesRoom: false,
  canActivateRoom(player) {
    return (player.roomType === 'clay' || player.roomType === 'stone') &&
             player.grain >= 1 && player.food >= 2
  },
  activateRoom(game, player) {
    player.removeResource('grain', 1)
    player.removeResource('food', 2)
    this.providesRoom = true
    game.log.add({
      template: '{player} activates Den Builder room for 1 grain and 2 food',
      args: { player },
    })
  },
}
