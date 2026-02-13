module.exports = {
  id: "mud-wallower-c148",
  name: "Mud Wallower",
  deck: "occupationC",
  number: 148,
  type: "occupation",
  players: "3+",
  text: "Each time you use an accumulation space, place 1 clay from the general supply on this card. You must immediately exchange 4 clay on this card for 1 wild boar, held by this card.",
  holdsAnimals: { boar: true },
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.clay = 0
    s.boar = 0
  },
  onAction(game, player, actionId) {
    if (game.isAccumulationSpace(actionId)) {
      const s = game.cardState(this.id)
      s.clay = (s.clay || 0) + 1
      while (s.clay >= 4) {
        s.clay -= 4
        s.boar = (s.boar || 0) + 1
        game.log.add({
          template: '{player} gets 1 wild boar on Mud Wallower',
          args: { player },
        })
      }
    }
  },
  getAnimalCapacity(game) {
    return game.cardState(this.id).boar || 0
  },
}
