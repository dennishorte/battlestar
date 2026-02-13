module.exports = {
  id: "master-builder-d087",
  name: "Master Builder",
  deck: "occupationD",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "Once your house has at least 5 rooms, at any time, but only once this game, you can add another room at no cost.",
  allowsAnytimeAction: true,
  onPlay(game, _player) {
    game.cardState(this.id).used = false
  },
  canUseFreeRoom(game, player) {
    return !game.cardState(this.id).used && player.getRoomCount() >= 5
  },
  useFreeRoom(game, player) {
    game.cardState(this.id).used = true
    game.actions.buildFreeRoom(player, this)
  },
}
