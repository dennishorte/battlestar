module.exports = {
  id: "mason-c087",
  name: "Mason",
  deck: "occupationC",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "Place a stone room on this card. Once you have a stone house with at least 4 rooms, at any time, you can add that room without paying any building resources.",
  onPlay(game, _player) {
    game.cardState(this.id).hasRoom = true
  },
  canAddFreeRoom(game, player) {
    return game.cardState(this.id).hasRoom && player.roomType === 'stone' && player.getRoomCount() >= 4
  },
  addFreeRoom(game, player) {
    game.cardState(this.id).hasRoom = false
    game.actions.buildFreeRoom(player, this)
  },
}
