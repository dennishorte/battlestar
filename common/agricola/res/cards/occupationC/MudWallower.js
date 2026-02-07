module.exports = {
  id: "mud-wallower-c148",
  name: "Mud Wallower",
  deck: "occupationC",
  number: 148,
  type: "occupation",
  players: "3+",
  text: "Each time you use an accumulation space, place 1 clay from the general supply on this card. You must immediately exchange 4 clay on this card for 1 wild boar, held by this card.",
  holdsAnimals: { boar: true },
  onPlay(_game, _player) {
    this.clay = 0
    this.boar = 0
  },
  onAction(game, player, actionId) {
    if (game.isAccumulationSpace(actionId)) {
      this.clay = (this.clay || 0) + 1
      while (this.clay >= 4) {
        this.clay -= 4
        this.boar = (this.boar || 0) + 1
        game.log.add({
          template: '{player} gets 1 wild boar on Mud Wallower',
          args: { player },
        })
      }
    }
  },
  getAnimalCapacity() {
    return this.boar || 0
  },
}
