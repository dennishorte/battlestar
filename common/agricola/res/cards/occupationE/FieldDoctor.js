module.exports = {
  id: "field-doctor-e092",
  name: "Field Doctor",
  deck: "occupationE",
  number: 92,
  type: "occupation",
  players: "1+",
  text: "Once this game, if you live in a house with exactly 2 rooms surrounded by 4 field tiles, you can use any \"Family Growth\" action space even without room.",
  onPlay(_game, _player) {
    this.used = false
  },
  allowsFamilyGrowthWithoutRoom(player) {
    return !this.used && player.getRoomCount() === 2 && player.getRoomsSurroundedByFields() >= 4
  },
  onFamilyGrowthWithoutRoom(_game, _player) {
    this.used = true
  },
}
