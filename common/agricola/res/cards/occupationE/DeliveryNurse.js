module.exports = {
  id: "delivery-nurse-e151",
  name: "Delivery Nurse",
  deck: "occupationE",
  number: 151,
  type: "occupation",
  players: "1+",
  text: "Once this game, if you have all types of animals, use any \"Family Growth\" action space even without room.",
  onPlay(game, _player) {
    game.cardState(this.id).used = false
  },
  allowsFamilyGrowthWithoutRoom(game, player) {
    return !game.cardState(this.id).used && player.hasAllAnimalTypes()
  },
  onFamilyGrowthWithoutRoom(game, _player) {
    game.cardState(this.id).used = true
  },
}
