module.exports = {
  id: "delivery-nurse-e151",
  name: "Delivery Nurse",
  deck: "occupationE",
  number: 151,
  type: "occupation",
  players: "1+",
  text: "Once this game, if you have all types of animals, use any \"Family Growth\" action space even without room.",
  onPlay(_game, _player) {
    this.used = false
  },
  allowsFamilyGrowthWithoutRoom(player) {
    return !this.used && player.hasAllAnimalTypes()
  },
  onFamilyGrowthWithoutRoom(_game, _player) {
    this.used = true
  },
}
