module.exports = {
  id: "master-tanner-e085",
  name: "Master Tanner",
  deck: "occupationE",
  number: 85,
  type: "occupation",
  players: "1+",
  text: "For each wild boar or cattle that you turn into food, you can place 1 of that food on this card. While its food equals your number of rooms, this card provides room for 1 person.",
  providesRoom: false,
  onPlay(_game, _player) {
    this.food = 0
  },
  onConvertAnimalToFood(game, player, animalType) {
    if (animalType === 'boar' || animalType === 'cattle') {
      this.food = (this.food || 0) + 1
      game.log.add({
        template: '{player} places 1 food on Master Tanner',
        args: { player },
      })
      this.checkRoom(player)
    }
  },
  checkRoom(player) {
    this.providesRoom = (this.food || 0) === player.getRoomCount()
  },
}
