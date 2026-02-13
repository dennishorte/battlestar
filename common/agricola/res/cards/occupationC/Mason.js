module.exports = {
  id: "mason-c087",
  name: "Mason",
  deck: "occupationC",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "Place a stone room on this card. Once you have a stone house with at least 4 rooms, at any time, you can add that room without paying any building resources.",
  allowsAnytimeAction: true,
  onPlay(game, _player) {
    game.cardState(this.id).hasRoom = true
  },
  canAddFreeRoom(game, player) {
    return game.cardState(this.id).hasRoom
      && player.roomType === 'stone'
      && player.getRoomCount() >= 4
      && player.getValidRoomBuildSpaces().length > 0
  },
  getAnytimeActions(game, player) {
    if (!this.canAddFreeRoom(game, player)) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'addFreeRoom',
      description: `${this.name}: Build a free stone room`,
    }]
  },
  addFreeRoom(game, player) {
    game.cardState(this.id).hasRoom = false
    game.actions.buildFreeRoom(player, this)
  },
}
