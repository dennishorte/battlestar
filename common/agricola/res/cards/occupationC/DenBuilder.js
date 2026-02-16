module.exports = {
  id: "den-builder-c085",
  name: "Den Builder",
  deck: "occupationC",
  number: 85,
  type: "occupation",
  players: "1+",
  text: "When you live in a clay or stone house, you can pay 1 grain and 2 food. If you do, for the rest of the game, this card provides room for exactly one person.",
  providesRoom: false,
  allowsAnytimeAction: true,
  canActivateRoom(player) {
    return (player.roomType === 'clay' || player.roomType === 'stone') &&
             player.grain >= 1 && player.food >= 2
  },
  getAnytimeActions(game, player) {
    if (!game.cardState(this.id).providesRoom && this.canActivateRoom(player)) {
      return [{
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'activateRoom',
        description: 'Den Builder: Pay 1 grain + 2 food for room',
      }]
    }
    return []
  },
  activateRoom(game, player) {
    player.payCost({ grain: 1, food: 2 })
    game.cardState(this.id).providesRoom = true
    game.log.add({
      template: '{player} activates Den Builder room for 1 grain and 2 food',
      args: { player },
    })
  },
}
