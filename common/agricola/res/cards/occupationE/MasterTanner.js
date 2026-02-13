module.exports = {
  id: "master-tanner-e085",
  name: "Master Tanner",
  deck: "occupationE",
  number: 85,
  type: "occupation",
  players: "1+",
  text: "For each wild boar or cattle that you turn into food, you can place 1 of that food on this card. While its food equals your number of rooms, this card provides room for 1 person.",
  providesRoom: false,
  onPlay(game, _player) {
    game.cardState(this.id).food = 0
  },
  onConvertAnimalToFood(game, player, animalType) {
    if (animalType === 'boar' || animalType === 'cattle') {
      const s = game.cardState(this.id)
      s.food = (s.food || 0) + 1
      game.log.add({
        template: '{player} places 1 food on Master Tanner',
        args: { player },
      })
      s.providesRoom = s.food === player.getRoomCount()
    }
  },
}
